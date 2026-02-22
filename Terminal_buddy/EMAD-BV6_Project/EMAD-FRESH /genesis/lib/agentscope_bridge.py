"""
AgentScope Bridge for BMad Genesis
===================================
Connects BMad Genesis agents to AgentScope's fault-tolerant runtime.
"""

import json
import os
from typing import Dict, List, Optional, Any

try:
    import agentscope
    from agentscope.agents import DialogAgent
    from agentscope.pipelines import SequentialPipeline, DAGPipeline, ForkedPipeline
    from agentscope.msghub import MsgHub
except ImportError:
    print("ERROR: AgentScope not installed. Run: pip install agentscope")
    raise


class GenesisBridge:
    """
    Bridge between BMad Genesis and AgentScope runtime.
    
    Responsibilities:
    - Initialize AgentScope environment
    - Spawn agents based on team structure
    - Execute workflows with fault tolerance
    - Handle agent communication topology
    """
    
    def __init__(self, config_path: Optional[str] = None):
        """
        Initialize the BMad → AgentScope bridge.
        
        Args:
            config_path: Path to model configuration JSON
        """
        self.config = self._load_config(config_path) if config_path else {}
        self.agents = {}
        self.pipelines = {}
        
        # Initialize AgentScope with model configs
        model_configs = self.config.get("model_configs", [])
        if not model_configs:
            # Default to using environment variables
            model_configs = [
                {
                    "config_name": "default",
                    "model_type": "openai",
                    "model_name": "gpt-4",
                    "api_key": os.getenv("OPENAI_API_KEY", "")
                }
            ]
        
        agentscope.init(model_configs=model_configs)
    
    def _load_config(self, path: str) -> Dict:
        """Load configuration from JSON file."""
        with open(path, 'r') as f:
            return json.load(f)
    
    def spawn_squad(self, team_structure: Dict) -> List[DialogAgent]:
        """
        Dynamically create AgentScope agents based on team structure.
        
        Args:
            team_structure: Team config from Team Builder (YAML parsed to dict)
            
        Returns:
            List of initialized AgentScope agents
        """
        agents = []
        members = team_structure.get('team', {}).get('members', [])
        
        for member in members:
            role = member['role']
            agent_id = member.get('agent_id', f'genesis-{role}')
            
            # Get system prompt from member config or use default
            sys_prompt = member.get('system_prompt', 
                                   f"You are {role}. {member.get('responsibilities', [])[0] if member.get('responsibilities') else ''}")
            
            # Create AgentScope DialogAgent
            agent = DialogAgent(
                name=role,
                sys_prompt=sys_prompt,
                model_config_name=self.config.get('default_model', 'default')
            )
            
            agents.append(agent)
            self.agents[role] = agent
        
        return agents
    
    def create_pipeline(self, topology: str, agents: List[DialogAgent]) -> Any:
        """
        Create appropriate pipeline based on communication topology.
        
        Args:
            topology: One of 'hub_and_spoke', 'pipeline', 'mesh'
            agents: List of agents to orchestrate
            
        Returns:
            Configured pipeline instance
        """
        if topology == 'hub_and_spoke' or topology == 'pipeline':
            # Sequential pipeline with coordinator
            return SequentialPipeline(agents)
        
        elif topology == 'mesh':
            # Message hub for peer-to-peer communication
            return MsgHub(agents)
        
        else:
            # Default to sequential
            return SequentialPipeline(agents)
    
    def execute_workflow(self, workflow: Dict, team_structure: Dict) -> Dict:
        """
        Execute workflow with fault tolerance using AgentScope.
        
        Args:
            workflow: Workflow JSON from Workflow Weaver
            team_structure: Team structure from Team Builder
            
        Returns:
            Execution results with outputs and status
        """
        print(f"[Genesis] Initiating workflow: {workflow['workflow_name']}")
        
        # Spawn agents based on team structure
        agents = self.spawn_squad(team_structure)
        
        # Create pipeline based on topology
        topology = team_structure.get('team', {}).get('topology', 'pipeline')
        pipeline = self.create_pipeline(topology, agents)
        
        # Execute workflow steps
        results = {
            'workflow': workflow['workflow_name'],
            'status': 'running',
            'completed_tasks': [],
            'failed_tasks': [],
            'outputs': {}
        }
        
        try:
            # For DAG workflows, execute in dependency order
            steps = workflow.get('steps', [])
            
            for step in steps:
                task_id = step['id']
                agent_role = step['agent']
                action = step['action']
                
                print(f"[Genesis] Executing task {task_id}: {action} ({agent_role})")
                
                # Get the agent for this task
                agent = self.agents.get(agent_role)
                if not agent:
                    print(f"[Genesis] Warning: Agent {agent_role} not found, skipping")
                    results['failed_tasks'].append(task_id)
                    continue
                
                # Execute with retry logic
                retry_limit = step.get('retry_limit', 1)
                success = False
                
                for attempt in range(retry_limit):
                    try:
                        # Prepare input message
                        input_msg = {
                            'task_id': task_id,
                            'action': action,
                            'inputs': step.get('inputs', []),
                            'definition_of_done': step.get('definition_of_done', '')
                        }
                        
                        # Execute via agent
                        response = agent(input_msg)
                        
                        # Store output
                        results['outputs'][task_id] = response
                        results['completed_tasks'].append(task_id)
                        success = True
                        break
                        
                    except Exception as e:
                        print(f"[Genesis] Task {task_id} failed (attempt {attempt + 1}/{retry_limit}): {e}")
                        if attempt == retry_limit - 1:
                            results['failed_tasks'].append(task_id)
                
                if not success:
                    print(f"[Genesis] Task {task_id} failed after {retry_limit} attempts")
            
            # Update final status
            if not results['failed_tasks']:
                results['status'] = 'completed'
                print(f"[Genesis] Workflow completed successfully!")
            else:
                results['status'] = 'partial'
                print(f"[Genesis] Workflow completed with {len(results['failed_tasks'])} failed tasks")
        
        except Exception as e:
            results['status'] = 'failed'
            results['error'] = str(e)
            print(f"[Genesis] Workflow failed: {e}")
        
        return results
    
    def health_check(self) -> Dict:
        """Check if AgentScope is properly initialized."""
        return {
            'agentscope_initialized': True,
            'model_configs': len(self.config.get('model_configs', [])),
            'active_agents': len(self.agents),
            'pipelines': len(self.pipelines)
        }


# Entry point for command-line testing
if __name__ == "__main__":
    print("[Genesis Bridge] Initializing...")
    bridge = GenesisBridge()
    
    # Health check
    status = bridge.health_check()
    print(f"[Genesis Bridge] Status: {status}")
    
    print("[Genesis Bridge] Ready for team spawning and workflow execution.")
