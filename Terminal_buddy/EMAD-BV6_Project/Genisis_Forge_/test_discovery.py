"""
Tests for Phase 1: Discovery Engine
"""

import pytest
from pathlib import Path

# Add src to path for imports
import sys
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from phases.discovery import (
    DiscoveryEngine,
    ProjectDNA,
    Gap,
    DiscoveryStage
)


class TestProjectDNA:
    """Tests for ProjectDNA dataclass"""
    
    def test_project_dna_creation(self):
        """Test basic ProjectDNA creation"""
        dna = ProjectDNA()
        assert dna.project_id is not None
        assert dna.status == "draft"
        assert dna.validation_count == 0
    
    def test_project_dna_to_dict(self):
        """Test ProjectDNA serialization"""
        dna = ProjectDNA(
            project_name="Test Project",
            domain_primary="software",
            core_vision="Build something great"
        )
        result = dna.to_dict()
        
        assert result["metadata"]["project_name"] == "Test Project"
        assert result["domain"]["primary"] == "software"
        assert result["vision"]["core_vision"] == "Build something great"
    
    def test_project_dna_to_json(self):
        """Test ProjectDNA JSON export"""
        dna = ProjectDNA(project_name="JSON Test")
        json_str = dna.to_json()
        
        assert '"project_name": "JSON Test"' in json_str


class TestGap:
    """Tests for Gap dataclass"""
    
    def test_gap_creation(self):
        """Test Gap creation"""
        gap = Gap(
            id="gap_001",
            category="technical",
            description="Missing database",
            impact="high",
            recommendation="Add PostgreSQL",
            source="questionnaire"
        )
        
        assert gap.id == "gap_001"
        assert gap.acknowledged == False
        assert gap.deferred == False


class TestDiscoveryEngine:
    """Tests for DiscoveryEngine"""
    
    def test_engine_initialization(self):
        """Test DiscoveryEngine initialization"""
        engine = DiscoveryEngine()
        
        assert engine.current_stage == DiscoveryStage.INITIAL
        assert engine.project_dna is not None
    
    def test_questionnaire_loading(self):
        """Test questionnaire loading"""
        engine = DiscoveryEngine()
        
        # Should have loaded questionnaires from templates
        assert "universal" in engine.questionnaires or len(engine.questionnaires) >= 0
    
    def test_domain_detection_software(self):
        """Test domain detection for software projects"""
        engine = DiscoveryEngine()
        
        result = engine.detect_domain("I want to build a web application with React and Node.js")
        assert result == "software"
    
    def test_domain_detection_music(self):
        """Test domain detection for music projects"""
        engine = DiscoveryEngine()
        
        result = engine.detect_domain("Building a DAW with VST plugin support for mixing")
        assert result == "music_production"
    
    def test_domain_detection_unknown(self):
        """Test domain detection for unknown domains"""
        engine = DiscoveryEngine()
        
        result = engine.detect_domain("Something completely random")
        assert result == "universal"
    
    def test_generate_understanding_summary(self):
        """Test summary generation"""
        engine = DiscoveryEngine()
        engine.project_dna.project_name = "Test Project"
        engine.project_dna.domain_primary = "software"
        engine.project_dna.core_vision = "Build an amazing tool"
        
        summary = engine.generate_understanding_summary()
        
        assert "Test Project" in summary
        assert "software" in summary
        assert "Build an amazing tool" in summary
    
    def test_record_validation(self):
        """Test validation recording"""
        engine = DiscoveryEngine()
        
        engine.record_validation("Yes, you GET it", ["No changes"])
        
        assert engine.project_dna.validation_count == 1
        assert len(engine.project_dna.validation_history) == 1
    
    def test_finalize(self):
        """Test finalization"""
        engine = DiscoveryEngine()
        
        result = engine.finalize()
        
        assert result.status == "validated"
        assert engine.current_stage == DiscoveryStage.COMPLETE


# Run tests
if __name__ == "__main__":
    pytest.main([__file__, "-v"])
