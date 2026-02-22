"""
Memvid Storage Bridge for BMad Genesis
=======================================
Handles video-based memory storage for project context and decisions.
"""

import os
import json
from typing import Dict, List, Optional, Any
from pathlib import Path

try:
    from memvid import MemVid, Config
except ImportError:
    print("ERROR: Memvid not installed. Run: pip install memvid")
    raise


class ProjectMemory:
    """
    Video-based memory storage for Genesis projects.
    
    Replaces traditional vector databases with portable .mp4 files
    that can be committed to version control.
    """
    
    def __init__(self, project_name: str, memory_dir: str = "_bmad-output/genesis/memory"):
        """
        Initialize project memory.
        
        Args:
            project_name: Name of the project
            memory_dir: Directory to store memory files
        """
        self.project_name = project_name
        self.memory_dir = Path(memory_dir)
        self.memory_dir.mkdir(parents=True, exist_ok=True)
        
        self.memory_file = self.memory_dir / f"{project_name}_memory.mp4"
        
        # Initialize MemVid with high-density configuration
        self.config = Config(
            video_codec="h265",  # H.265 for better compression
            frame_size=512,      # High-res QR codes for more data
            fps=30               # Standard frame rate
        )
        
        # Load or create memory store
        if self.memory_file.exists():
            print(f"[Memvid] Loading existing memory: {self.memory_file}")
            self.store = MemVid.load(str(self.memory_file), config=self.config)
        else:
            print(f"[Memvid] Creating new memory: {self.memory_file}")
            self.store = MemVid(str(self.memory_file), config=self.config)
    
    def ingest_project_dna(self, project_dna: Dict) -> None:
        """
        Store Project DNA analysis in video memory.
        
        Args:
            project_dna: DNA report from Deep Auditor
        """
        print(f"[Memvid] Encoding Project DNA for {self.project_name}...")
        
        # Convert to JSON string for storage
        dna_json = json.dumps(project_dna, indent=2)
        
        # Add to memory with metadata
        self.store.add_text(
            text=dna_json,
            metadata={
                'type': 'project_dna',
                'project': self.project_name,
                'timestamp': self._get_timestamp()
            }
        )
        
        self.store.save()
        print(f"[Memvid] Project DNA encoded successfully")
    
    def ingest_team_structure(self, team_structure: Dict) -> None:
        """
        Store team structure in video memory.
        
        Args:
            team_structure: Team config from Team Builder
        """
        print(f"[Memvid] Encoding team structure...")
        
        team_json = json.dumps(team_structure, indent=2)
        
        self.store.add_text(
            text=team_json,
            metadata={
                'type': 'team_structure',
                'project': self.project_name,
                'timestamp': self._get_timestamp()
            }
        )
        
        self.store.save()
        print(f"[Memvid] Team structure encoded")
    
    def ingest_workflow(self, workflow: Dict) -> None:
        """
        Store workflow plan in video memory.
        
        Args:
            workflow: Workflow from Workflow Weaver
        """
        print(f"[Memvid] Encoding workflow plan...")
        
        workflow_json = json.dumps(workflow, indent=2)
        
        self.store.add_text(
            text=workflow_json,
            metadata={
                'type': 'workflow',
                'project': self.project_name,
                'timestamp': self._get_timestamp()
            }
        )
        
        self.store.save()
        print(f"[Memvid] Workflow encoded")
    
    def ingest_directory(self, directory_path: str, extensions: Optional[List[str]] = None) -> None:
        """
        Scan directory and encode all relevant files.
        
        Args:
            directory_path: Path to project directory
            extensions: List of file extensions to include (e.g., ['.py', '.js', '.md'])
        """
        print(f"[Memvid] Scanning directory: {directory_path}")
        
        if extensions is None:
            # Default to common code/config files
            extensions = [
                '.py', '.js', '.ts', '.jsx', '.tsx',
                '.java', '.go', '.rs', '.c', '.cpp',
                '.md', '.txt', '.json', '.yaml', '.yml',
                '.html', '.css', '.scss'
            ]
        
        path = Path(directory_path)
        if not path.exists():
            print(f"[Memvid] Warning: Directory not found: {directory_path}")
            return
        
        files_added = 0
        for ext in extensions:
            for file_path in path.rglob(f'*{ext}'):
                try:
                    # Skip large files and common ignore patterns
                    if file_path.stat().st_size > 1_000_000:  # 1MB limit
                        continue
                    
                    if any(ignore in str(file_path) for ignore in 
                           ['node_modules', '.git', '__pycache__', 'venv', '.venv']):
                        continue
                    
                    # Read and add file
                    content = file_path.read_text(encoding='utf-8', errors='ignore')
                    
                    self.store.add_text(
                        text=content,
                        metadata={
                            'type': 'source_file',
                            'file_path': str(file_path),
                            'file_type': ext,
                            'project': self.project_name
                        }
                    )
                    
                    files_added += 1
                    
                except Exception as e:
                    print(f"[Memvid] Warning: Could not process {file_path}: {e}")
        
        if files_added > 0:
            self.store.save()
            print(f"[Memvid] Encoded {files_added} files")
        else:
            print(f"[Memvid] No files found to encode")
    
    def recall(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        """
        Search memory using semantic search.
        
        Args:
            query: Search query (e.g., "database schema decisions")
            top_k: Number of results to return
            
        Returns:
            List of matching results with text and metadata
        """
        print(f"[Memvid] Searching memory: '{query}'")
        
        try:
            results = self.store.search(query, top_k=top_k)
            
            formatted_results = []
            for result in results:
                formatted_results.append({
                    'text': result.text,
                    'metadata': result.metadata,
                    'score': result.score if hasattr(result, 'score') else None
                })
            
            print(f"[Memvid] Found {len(formatted_results)} results")
            return formatted_results
        
        except Exception as e:
            print(f"[Memvid] Search failed: {e}")
            return []
    
    def get_project_dna(self) -> Optional[Dict]:
        """Retrieve stored Project DNA."""
        results = self.recall("project_dna type:project_dna", top_k=1)
        if results:
            try:
                return json.loads(results[0]['text'])
            except json.JSONDecodeError:
                return None
        return None
    
    def get_team_structure(self) -> Optional[Dict]:
        """Retrieve stored team structure."""
        results = self.recall("team_structure type:team_structure", top_k=1)
        if results:
            try:
                return json.loads(results[0]['text'])
            except json.JSONDecodeError:
                return None
        return None
    
    def export_memory(self, output_path: Optional[str] = None) -> str:
        """
        Export memory file for sharing or version control.
        
        Args:
            output_path: Destination path (default: current memory file)
            
        Returns:
            Path to exported file
        """
        export_path = output_path or str(self.memory_file)
        
        print(f"[Memvid] Exporting memory to: {export_path}")
        self.store.save()
        
        file_size = Path(export_path).stat().st_size
        print(f"[Memvid] Memory exported ({file_size / 1024:.1f} KB)")
        
        return export_path
    
    def get_stats(self) -> Dict:
        """Get memory statistics."""
        return {
            'project_name': self.project_name,
            'memory_file': str(self.memory_file),
            'file_exists': self.memory_file.exists(),
            'file_size_kb': self.memory_file.stat().st_size / 1024 if self.memory_file.exists() else 0,
            'total_entries': len(self.store) if hasattr(self.store, '__len__') else 'unknown'
        }
    
    def _get_timestamp(self) -> str:
        """Get current timestamp for metadata."""
        from datetime import datetime
        return datetime.now().isoformat()


# Entry point for command-line testing
if __name__ == "__main__":
    print("[Memvid Bridge] Initializing...")
    
    memory = ProjectMemory("test_project")
    
    # Test Project DNA storage
    test_dna = {
        'project_name': 'test_project',
        'maturity': 'Greenfield',
        'core_stack': ['Python', 'FastAPI']
    }
    
    memory.ingest_project_dna(test_dna)
    
    # Stats
    stats = memory.get_stats()
    print(f"[Memvid Bridge] Stats: {stats}")
    
    print("[Memvid Bridge] Ready for project memory storage.")
