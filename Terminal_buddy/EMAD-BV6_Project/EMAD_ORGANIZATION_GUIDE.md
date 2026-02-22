            # EMAD/BMAD Project Organization Guide

**Created:** 2026-02-06
**Status:** Your workspace is currently scattered - this guide will help you reorganize

---

## 🚨 CURRENT PROBLEM

You have **duplicate EMAD installations** scattered across your workspace:

```
EMAD-BV6_Project/
├── EMAD-main/                    ← Main EMAD folder
│   ├── EMAD-main/                ← Duplicate EMAD nested inside
│   └── BMAD_System/
│       ├── EMAD-FRESH /          ← Another EMAD copy
│       └── BMAD-METHOD-.../
│           └── src/The_Forge_System/
│               └── EMAD-BV6_Project/   ← RECURSIVE NESTING!
│                   ├── EMAD-main/
│                   │   └── EMAD-main/  ← More duplicates
│                   └── EMAD-FRESH /
├── EMAD-FRESH /                  ← Separate EMAD installation
├── BMAD-METHOD-6.0.0-alpha.23/   ← BMAD v6 Alpha
├── BMAD-v6/                      ← Another BMAD v6
├── bmad-genesis-module/          ← Genesis module
├── _bmad/                        ← Active BMAD installation?
└── megabmadadd/                  ← Unknown purpose
```

**The Result:** Files exist in 10+ locations. You don't know which is current.

---

## ✅ RECOMMENDED CLEAN STRUCTURE

Here's what your workspace **should** look like:

```
EMAD-BV6_Project/
├── 📁 CURRENT/                    ← Active working version (choose ONE)
│   ├── emad/                      ← Core EMAD system files
│   ├── bmad/                      ← Core BMAD system files
│   ├── config/                    ← Configuration
│   └── output/                    ← Generated artifacts
│
├── 📁 ARCHIVE/                    ← Old versions (keep for reference)
│   ├── EMAD-old-2026-01/
│   ├── BMAD-alpha-23/
│   └── BMAD-v6-backup/
│
├── 📁 DOCS/                       ← All documentation
│   ├── guides/
│   ├── architecture/
│   └── analysis/
│
├── 📁 MODULES/                    ← Installable modules
│   ├── bmad-genesis/
│   └── project-wrangler/
│
└── README.md                      ← Master project overview
```

---

## 🎯 ACTION PLAN

### Phase 1: IDENTIFY THE CURRENT VERSION (DO THIS FIRST)

**Answer these questions:**

1. **Which EMAD/BMAD version are you actively using?**
   - [ ] BMAD v6 (BMAD-METHOD-6.0.0-alpha.23/)
   - [ ] BMAD v6 (BMAD-v6/)
   - [ ] Genesis Module (bmad-genesis-module/)
   - [ ] The _bmad/ folder
   - [ ] Don't know / none work

2. **Which folder has your working files?**
   - Check modification dates: `ls -lt | head -20`
   - Check which has recent Git commits
   - Check which folders you actually use

3. **Do you have custom configurations you want to keep?**
   - Look in `_bmad/_config/`
   - Look for `.yaml` files
   - Look for custom agent definitions

### Phase 2: CONSOLIDATE (After identifying current version)

I'll create a script to:
1. Create the clean folder structure
2. Move your current working version to `CURRENT/`
3. Archive old versions
4. Organize documentation
5. Remove duplicate/nested folders

### Phase 3: SET UP CLEAN ENVIRONMENT

1. **Single entry point** - One README that explains everything
2. **Clear version indicators** - Know what version you're running
3. **Consistent paths** - Everything in predictable locations
4. **Documentation index** - Find any doc in seconds

---

## 🔍 QUICK DIAGNOSIS

Run this command to see which folders were modified recently:

```bash
cd /home/dylaroo/EMAD-BV6_Project
find . -maxdepth 2 -type d -name "*EMAD*" -o -name "*BMAD*" | while read dir; do
  echo "---"
  echo "📁 $dir"
  echo "Modified: $(stat -c %y "$dir" 2>/dev/null | cut -d' ' -f1)"
  echo "Size: $(du -sh "$dir" 2>/dev/null | cut -f1)"
done
```

---

## 📋 WHAT YOU HAVE NOW

### EMAD Versions Found:
- `EMAD-main/` - Unknown version
- `EMAD-FRESH /` - Unknown version (3+ copies)
- Nested copies inside BMAD system folders

### BMAD Versions Found:
- `BMAD-METHOD-6.0.0-alpha.23/` - Alpha version 23
- `BMAD-v6/` - Version 6 (stable?)
- `bmad-genesis-module/` - Version 1.0.0-alpha.1
- `_bmad/` - Active installation?

### Supporting Folders:
- `_bmad-output/` - Generated artifacts
- `docs/` - Documentation
- `dylaroo/` - Custom Python module

---

## 🚀 NEXT STEPS

**Tell me:**

1. **Which folder do you actually use day-to-day?**
2. **Do any of these folders actually work when you try to run them?**
3. **Do you want to start fresh with a clean v6 install?**

Once you answer, I'll:
- Create cleanup/reorganization scripts
- Build a single source of truth structure
- Set up proper documentation
- Make it easy to find everything

---

## 💡 WHY THIS HAPPENED

Common causes of scattered project structures:
- Multiple Git clones to different locations
- Copying folders "just in case"
- Installation scripts creating nested directories
- Extracting archives without checking existing folders
- Updates/upgrades creating parallel installations

**The fix:** Decide on ONE active version, archive the rest, document everything.

---

## 📞 READY TO CLEAN THIS UP?

Just tell me which version you want to keep, and I'll handle the reorganization automatically.
