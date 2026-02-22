"""
Genesis Phase 1: Discovery Engine
Deep Project Understanding System

This module handles the comprehensive discovery process that builds
a complete understanding of any project before workflow or team creation.
"""

import json
import yaml
from pathlib import Path
from datetime import datetime
from typing import Optional, Dict, List, Any
from dataclasses import dataclass, field
from enum import Enum
import uuid


class DiscoveryStage(Enum):
    """Stages of the discovery process"""
    INITIAL = "initial_discovery"
    STAKEHOLDER = "stakeholder_analysis"
    DOMAIN_DEEP_DIVE = "domain_deep_dive"
    RESEARCH = "research_gap_discovery"
    VALIDATION = "validation_loop"
    COMPLETE = "complete"


class ValidationStatus(Enum):
    """Status of user validation"""
    PENDING = "pending"
    APPROVED = "approved"
    NEEDS_REVISION = "needs_revision"
    DEFERRED = "deferred"


@dataclass
class Gap:
    """Represents a discovered gap in the project"""
    id: str
    category: str  # technical, compliance, process, expertise, resource, strategic
    description: str
    impact: str  # critical, high, medium, low
    recommendation: str
    source: str  # questionnaire, research, inference
    acknowledged: bool = False
    deferred: bool = False


@dataclass 
class ResearchFinding:
    """Represents a finding from research"""
    topic: str
    source: str
    finding: str
    relevance: str
    timestamp: datetime = field(default_factory=datetime.now)


@dataclass
class ProjectDNA:
    """
    The comprehensive project understanding document.
    This is the core output of Phase 1.
    """
    # Metadata
    project_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    project_name: str = ""
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    version: str = "1.0"
    status: str = "draft"
    validation_count: int = 0
    
    # Domain
    domain_primary: str = ""
    domain_secondary: List[str] = field(default_factory=list)
    industry: str = ""
    domain_context: Dict[str, Any] = field(default_factory=dict)
    
    # Vision
    core_vision: str = ""
    problem_statement: str = ""
    solution_approach: str = ""
    unique_value_proposition: str = ""
    success_criteria: List[Dict[str, Any]] = field(default_factory=list)
    project_origin: Dict[str, str] = field(default_factory=dict)
    
    # Stakeholders
    end_users: List[Dict[str, Any]] = field(default_factory=list)
    decision_makers: List[Dict[str, Any]] = field(default_factory=list)
    funding: Dict[str, Any] = field(default_factory=dict)
    beneficiaries: List[str] = field(default_factory=list)
    gatekeepers: List[Dict[str, Any]] = field(default_factory=list)
    
    # Requirements
    functional_requirements: List[str] = field(default_factory=list)
    non_functional_requirements: List[str] = field(default_factory=list)
    technical_requirements: Dict[str, Any] = field(default_factory=dict)
    constraints: List[Dict[str, Any]] = field(default_factory=list)
    timeline: Dict[str, Any] = field(default_factory=dict)
    
    # Current State
    current_state: Dict[str, Any] = field(default_factory=dict)
    
    # Gaps & Research
    gaps: List[Gap] = field(default_factory=list)
    research_findings: List[ResearchFinding] = field(default_factory=list)
    
    # Risks
    risks: List[Dict[str, Any]] = field(default_factory=list)
    
    # Recommendations
    specialist_types_needed: List[Dict[str, Any]] = field(default_factory=list)
    suggested_workflows: List[str] = field(default_factory=list)
    suggested_methodologies: List[str] = field(default_factory=list)
    
    # Validation History
    validation_history: List[Dict[str, Any]] = field(default_factory=list)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization"""
        return {
            "metadata": {
                "project_id": self.project_id,
                "project_name": self.project_name,
                "created_at": self.created_at.isoformat(),
                "updated_at": self.updated_at.isoformat(),
                "version": self.version,
                "status": self.status,
                "validation_count": self.validation_count
            },
            "domain": {
                "primary": self.domain_primary,
                "secondary": self.domain_secondary,
                "industry": self.industry,
                "domain_specific_context": self.domain_context
            },
            "vision": {
                "core_vision": self.core_vision,
                "problem_statement": self.problem_statement,
                "solution_approach": self.solution_approach,
                "unique_value_proposition": self.unique_value_proposition,
                "success_criteria": self.success_criteria,
                "project_origin": self.project_origin
            },
            "stakeholders": {
                "end_users": self.end_users,
                "decision_makers": self.decision_makers,
                "funding": self.funding,
                "beneficiaries": self.beneficiaries,
                "gatekeepers": self.gatekeepers
            },
            "requirements": {
                "functional": self.functional_requirements,
                "non_functional": self.non_functional_requirements,
                "technical": self.technical_requirements,
                "constraints": self.constraints,
                "timeline": self.timeline
            },
            "current_state": self.current_state,
            "gaps": {
                "identified": [
                    {
                        "id": g.id,
                        "category": g.category,
                        "description": g.description,
                        "impact": g.impact,
                        "recommendation": g.recommendation,
                        "source": g.source
                    } for g in self.gaps
                ],
                "user_acknowledged": [g.id for g in self.gaps if g.acknowledged],
                "user_deferred": [g.id for g in self.gaps if g.deferred]
            },
            "research_findings": [
                {
                    "topic": r.topic,
                    "source": r.source,
                    "finding": r.finding,
                    "relevance": r.relevance
                } for r in self.research_findings
            ],
            "risks": self.risks,
            "recommendations": {
                "specialist_types_needed": self.specialist_types_needed,
                "suggested_workflows": self.suggested_workflows,
                "suggested_methodologies": self.suggested_methodologies
            },
            "validation_history": self.validation_history
        }
    
    def to_json(self, indent: int = 2) -> str:
        """Export as JSON string"""
        return json.dumps(self.to_dict(), indent=indent)
    
    def save(self, path: Path) -> None:
        """Save Project DNA to file"""
        self.updated_at = datetime.now()
        with open(path, 'w') as f:
            f.write(self.to_json())


class DiscoveryEngine:
    """
    Main discovery engine that orchestrates Phase 1.
    
    Responsibilities:
    - Load and present questionnaires
    - Collect and validate responses
    - Trigger gap discovery rules
    - Coordinate research
    - Build Project DNA
    - Manage validation loops
    """
    
    def __init__(self, config_path: Optional[Path] = None):
        self.config = self._load_config(config_path)
        self.questionnaires = {}
        self.current_stage = DiscoveryStage.INITIAL
        self.project_dna = ProjectDNA()
        self._load_questionnaires()
    
    def _load_config(self, path: Optional[Path]) -> Dict[str, Any]:
        """Load configuration from YAML"""
        if path is None:
            path = Path(__file__).parent.parent.parent / "config" / "genesis.yaml"
        
        if path.exists():
            with open(path) as f:
                return yaml.safe_load(f)
        return {}
    
    def _load_questionnaires(self) -> None:
        """Load all questionnaire templates"""
        template_dir = Path(__file__).parent.parent.parent / "templates" / "questionnaires"
        
        if template_dir.exists():
            for yaml_file in template_dir.glob("*.yaml"):
                with open(yaml_file) as f:
                    questionnaire = yaml.safe_load(f)
                    domain = questionnaire.get("domain", yaml_file.stem)
                    self.questionnaires[domain] = questionnaire
    
    def get_questionnaire(self, domain: str) -> Optional[Dict[str, Any]]:
        """Get questionnaire for a specific domain"""
        return self.questionnaires.get(domain)
    
    def detect_domain(self, user_input: str) -> str:
        """
        Detect project domain from user input.
        Returns the most likely domain key.
        """
        domain_keywords = {
            "software": ["code", "app", "application", "software", "website", "api", 
                        "database", "frontend", "backend", "developer"],
            "music_production": ["music", "daw", "audio", "plugin", "vst", "mixing",
                                "production", "sound", "synth", "beats"],
            "manufacturing": ["manufacturing", "production line", "factory", "quality control",
                             "assembly", "iso", "six sigma"],
            "therapy_counseling": ["therapy", "counseling", "mental health", "psychology",
                                  "therapist", "counselor", "patients", "clients"],
            "healthcare": ["healthcare", "medical", "health", "patient", "clinical",
                          "hospital", "diagnosis", "treatment"]
        }
        
        user_lower = user_input.lower()
        scores = {}
        
        for domain, keywords in domain_keywords.items():
            score = sum(1 for kw in keywords if kw in user_lower)
            if score > 0:
                scores[domain] = score
        
        if scores:
            return max(scores, key=scores.get)
        return "universal"
    
    def evaluate_gap_triggers(self, responses: Dict[str, Any], domain: str) -> List[Gap]:
        """
        Evaluate gap discovery triggers based on questionnaire responses.
        Returns list of identified gaps.
        """
        gaps = []
        questionnaire = self.get_questionnaire(domain)
        
        if not questionnaire:
            return gaps
        
        triggers = questionnaire.get("gap_triggers", [])
        
        for trigger in triggers:
            # Simple condition evaluation (in production, use a proper rule engine)
            condition = trigger.get("condition", "")
            gap_description = trigger.get("gap", "")
            
            # This is a simplified evaluation - production would use a proper rule engine
            if self._evaluate_condition(condition, responses):
                gap = Gap(
                    id=str(uuid.uuid4())[:8],
                    category="inference",
                    description=gap_description,
                    impact="medium",
                    recommendation=gap_description,
                    source="questionnaire_trigger"
                )
                gaps.append(gap)
        
        return gaps
    
    def _evaluate_condition(self, condition: str, responses: Dict[str, Any]) -> bool:
        """
        Evaluate a condition string against responses.
        Simplified implementation - production would use proper rule engine.
        """
        # Placeholder - implement proper condition evaluation
        return False
    
    def generate_understanding_summary(self) -> str:
        """
        Generate a human-readable summary of current understanding.
        Used for validation loop.
        """
        dna = self.project_dna
        
        summary = f"""
## My Understanding of Your Project

**Project:** {dna.project_name or 'Unnamed Project'}
**Domain:** {dna.domain_primary}

### Vision
{dna.core_vision}

### What You're Building
{dna.solution_approach or 'To be defined'}

### Success Looks Like
"""
        for criterion in dna.success_criteria:
            summary += f"- {criterion.get('criterion', '')}\n"
        
        summary += f"""
### Key Stakeholders
**End Users:** {', '.join([u.get('segment', '') for u in dna.end_users]) or 'To be defined'}
**Decision Makers:** {', '.join([d.get('name_role', '') for d in dna.decision_makers]) or 'To be defined'}

### Gaps I've Identified
"""
        if dna.gaps:
            for gap in dna.gaps:
                summary += f"- **{gap.impact.upper()}:** {gap.description}\n"
        else:
            summary += "- None identified yet\n"
        
        summary += """
### Does This Capture Your Project?
- ✅ "Yes, you GET it" - Proceed to workflow planning
- 🔄 "Not quite" - Tell me what I missed
- ❓ "I need to think about..." - We can pause here
"""
        return summary
    
    def record_validation(self, response: str, changes: List[str] = None) -> None:
        """Record a validation iteration"""
        self.project_dna.validation_count += 1
        self.project_dna.validation_history.append({
            "iteration": self.project_dna.validation_count,
            "timestamp": datetime.now().isoformat(),
            "user_response": response,
            "changes_made": changes or []
        })
    
    def finalize(self) -> ProjectDNA:
        """Finalize the discovery phase"""
        self.project_dna.status = "validated"
        self.project_dna.updated_at = datetime.now()
        self.current_stage = DiscoveryStage.COMPLETE
        return self.project_dna


# CLI Interface (for testing)
def main():
    """Interactive CLI for testing discovery engine"""
    print("=" * 60)
    print("Genesis Phase 1: Discovery Engine")
    print("=" * 60)
    print()
    
    engine = DiscoveryEngine()
    
    print("Available questionnaires:")
    for domain in engine.questionnaires:
        print(f"  - {domain}")
    
    print()
    print("Tell me about your project...")
    # In production, this would be an interactive loop


if __name__ == "__main__":
    main()
