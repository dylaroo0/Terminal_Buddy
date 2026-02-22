"""
Genesis CLI - Universal Project Architect
Command-line interface for the Genesis system.
"""

import argparse
import sys
from pathlib import Path


def main():
    """Main CLI entry point"""
    parser = argparse.ArgumentParser(
        description="Genesis - Universal Project Architect",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  genesis discover --interactive     Start interactive discovery session
  genesis discover --project myproj  Run discovery for named project
  genesis workflow --input dna.json  Generate workflows from Project DNA
  genesis team --input workflow.yaml Build team from workflow plan
        """
    )
    
    subparsers = parser.add_subparsers(dest="command", help="Available commands")
    
    # Discovery command
    discover_parser = subparsers.add_parser("discover", help="Run Phase 1: Discovery")
    discover_parser.add_argument("--interactive", "-i", action="store_true",
                                  help="Run in interactive mode")
    discover_parser.add_argument("--project", "-p", type=str,
                                  help="Project name")
    discover_parser.add_argument("--domain", "-d", type=str,
                                  help="Initial domain (software, music_production, etc.)")
    discover_parser.add_argument("--output", "-o", type=Path,
                                  help="Output path for Project DNA")
    
    # Workflow command
    workflow_parser = subparsers.add_parser("workflow", help="Run Phase 2: Workflow Planning")
    workflow_parser.add_argument("--input", "-i", type=Path, required=True,
                                  help="Project DNA JSON file")
    workflow_parser.add_argument("--output", "-o", type=Path,
                                  help="Output path for workflow plan")
    
    # Team command  
    team_parser = subparsers.add_parser("team", help="Run Phase 3: Team Building")
    team_parser.add_argument("--input", "-i", type=Path, required=True,
                              help="Workflow plan YAML file")
    team_parser.add_argument("--output", "-o", type=Path,
                              help="Output path for team configuration")
    
    # Execute command
    execute_parser = subparsers.add_parser("execute", help="Run Phase 4: Execution")
    execute_parser.add_argument("--team", "-t", type=Path, required=True,
                                 help="Team configuration file")
    execute_parser.add_argument("--workflow", "-w", type=Path, required=True,
                                 help="Workflow plan file")
    
    # Status command
    status_parser = subparsers.add_parser("status", help="Check project status")
    status_parser.add_argument("--project", "-p", type=str,
                                help="Project name or ID")
    
    args = parser.parse_args()
    
    if args.command is None:
        parser.print_help()
        return 0
    
    if args.command == "discover":
        from src.phases.discovery import DiscoveryEngine, main as discover_main
        if args.interactive:
            discover_main()
        else:
            print("Non-interactive discovery not yet implemented")
            return 1
            
    elif args.command == "workflow":
        print("Phase 2: Workflow Planning not yet implemented")
        return 1
        
    elif args.command == "team":
        print("Phase 3: Team Building not yet implemented")
        return 1
        
    elif args.command == "execute":
        print("Phase 4: Execution not yet implemented")
        return 1
        
    elif args.command == "status":
        print("Status command not yet implemented")
        return 1
    
    return 0


if __name__ == "__main__":
    sys.exit(main())
