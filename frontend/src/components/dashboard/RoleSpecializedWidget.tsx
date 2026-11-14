import React, { useState, useEffect } from 'react';
import { ProfessionalRole } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import {
  Clapperboard,
  Scissors,
  Music,
  Camera,
  Feather,
  Wand2,
  Sparkles,
  Briefcase,
  Plus,
  Trash2,
  Layers,
  CheckCircle2,
  Palette,
  Zap,
  Sun,
  ClipboardCheck,
  UserCheck,
  BookOpen,
  Radio,
  Mic,
  Clock
} from 'lucide-react';

interface WorkbenchItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
}

interface RoleSpecializedWidgetProps {
  role: ProfessionalRole;
  onActionClick?: (actionType: string) => void;
}

export const RoleSpecializedWidget: React.FC<RoleSpecializedWidgetProps> = ({ role, onActionClick }) => {
  const { theme } = useTheme();
  const storageKey = `cv_workbench_${role}`;

  const [items, setItems] = useState<WorkbenchItem[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    setItems(saved ? JSON.parse(saved) : []);
    setIsAdding(false);
  }, [role, storageKey]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: WorkbenchItem = {
      id: `wb-${Date.now()}`,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'Active Production',
      tag: newTag.trim() || 'In Progress'
    };

    const updated = [newItem, ...items];
    setItems(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));

    setNewTitle('');
    setNewSubtitle('');
    setNewTag('');
    setIsAdding(false);
  };

  const handleDeleteItem = (id: string) => {
    const updated = items.filter(it => it.id !== id);
    setItems(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const getRoleMeta = () => {
    switch (role) {
      case 'DIRECTOR':
        return {
          icon: Clapperboard,
          label: "Director's Production Slates",
          desc: 'Your active feature films, scene breakdowns, and creative team tracking',
          addBtn: 'Add Slate / Project',
          inputTitle: 'Film Project Title',
          inputSub: 'Production Stage',
          inputTag: 'Priority / Status'
        };
      case 'PRODUCER':
        return {
          icon: Briefcase,
          label: 'Producer Opportunity & Recruitment Console',
          desc: 'Manage production budgets, talent hiring, and casting calls',
          addBtn: 'Add Production Track',
          inputTitle: 'Production Name',
          inputSub: 'Financing or Stage',
          inputTag: 'Recruitment Status'
        };
      case 'WRITER':
        return {
          icon: Feather,
          label: "Writer's Screenplay & Narrative Vault",
          desc: 'Your registered screenplays, treatments, loglines, and co-writing projects',
          addBtn: 'Register Screenplay / Script',
          inputTitle: 'Screenplay Title',
          inputSub: 'Genre & Format',
          inputTag: 'Draft Version'
        };
      case 'ACTOR':
        return {
          icon: Sparkles,
          label: 'Actor Audition & Callback Tracker',
          desc: 'Your active casting submissions, callback invitations, and self-tapes',
          addBtn: 'Log Audition / Callback',
          inputTitle: 'Role / Character Name',
          inputSub: 'Project Name',
          inputTag: 'Audition Status'
        };
      case 'CINEMATOGRAPHER':
        return {
          icon: Camera,
          label: 'Cinematographer Optical Packages & Shot Lists',
          desc: 'Your registered camera packages, anamorphic lenses, and lighting plans',
          addBtn: 'Add Camera Package',
          inputTitle: 'Camera & Lens Package Name',
          inputSub: 'Glass & Optical Configuration',
          inputTag: 'Sensor Format'
        };
      case 'EDITOR':
        return {
          icon: Scissors,
          label: 'Editor Timeline Assemblies & Cuts',
          desc: 'Your active rough cut assemblies, picture locks, and NLE conforming',
          addBtn: 'Log Edit Reel / Cut',
          inputTitle: 'Edit Sequence Title',
          inputSub: 'Reel or Sequence Details',
          inputTag: 'Cut Status'
        };
      case 'MUSIC_DIRECTOR':
        return {
          icon: Music,
          label: 'Composer Scoring Stage & Cue Sheet',
          desc: 'Your registered soundtrack cues, orchestral arrangements, and stems',
          addBtn: 'Add Music Cue',
          inputTitle: 'Cue Name',
          inputSub: 'Instrumentation',
          inputTag: 'Mix Stage'
        };
      case 'VFX_ARTIST':
        return {
          icon: Wand2,
          label: 'VFX CGI Pipeline & Shots',
          desc: 'Your active CGI shots, virtual volume LED stages, and render assets',
          addBtn: 'Log VFX Shot',
          inputTitle: 'Shot Code',
          inputSub: 'Sequence Description',
          inputTag: 'Software / Pipeline'
        };
      case 'ANIMATOR':
        return {
          icon: Layers,
          label: 'Animation Stage & Character Rigs',
          desc: 'Your 2D/3D character rigs, keyframe shot reels, and kinetics',
          addBtn: 'Log Animation Sequence',
          inputTitle: 'Sequence Title / Character',
          inputSub: 'Rigging / Software',
          inputTag: 'Keyframe Status'
        };
      case 'COLORIST':
        return {
          icon: Palette,
          label: 'Color Grading Suite & Film LUTs',
          desc: 'Your DaVinci Resolve color passes, 3D LUT profiles, and HDR reels',
          addBtn: 'Add Color Session / Look',
          inputTitle: 'Film Look / Reel Title',
          inputSub: 'Color Space & Grading Suite',
          inputTag: 'Pass Status'
        };
      case 'STUNT_COORDINATOR':
        return {
          icon: Zap,
          label: 'Action & Stunt Rigging Choreography',
          desc: 'Your stunt sequences, wirework rigging rigs, and safety checklists',
          addBtn: 'Log Action Sequence',
          inputTitle: 'Action Scene Code',
          inputSub: 'Choreography Type',
          inputTag: 'Safety Clearance'
        };
      case 'GAFFER':
        return {
          icon: Sun,
          label: 'Gaffer Lighting Plots & Rig Roster',
          desc: 'Your HMI setups, lighting design plots, and electric distribution',
          addBtn: 'Add Lighting Setup',
          inputTitle: 'Scene Lighting Setup Name',
          inputSub: 'Fixtures & Watts',
          inputTag: 'Grid Status'
        };
      case 'LINE_PRODUCER':
        return {
          icon: ClipboardCheck,
          label: 'Line Producer Daily Slate & Logistics',
          desc: 'Shooting schedules, below-the-line budget lines, and daily call sheets',
          addBtn: 'Add Production Schedule Item',
          inputTitle: 'Production Day / Unit Code',
          inputSub: 'Budget Line or Location Item',
          inputTag: 'Schedule Status'
        };
      case 'CASTING_DIRECTOR':
        return {
          icon: UserCheck,
          label: 'Casting Breakdowns & Callbacks',
          desc: 'Character audition briefs, actor callbacks, and tape reviews',
          addBtn: 'Create Casting Breakdown',
          inputTitle: 'Character Name & Archetype',
          inputSub: 'Project Name / Age Range',
          inputTag: 'Callback Status'
        };
      case 'SCRIPT_SUPERVISOR':
        return {
          icon: BookOpen,
          label: 'Script Continuity & Take Logs',
          desc: 'Scene coverage, take timing, and editorial alignment notes',
          addBtn: 'Log Continuity Record',
          inputTitle: 'Scene & Slate',
          inputSub: 'Action Continuity & Eyeline Details',
          inputTag: 'Take Verdict'
        };
      case 'DRONE_OPERATOR':
        return {
          icon: Radio,
          label: 'Aerial Drone Flights & Telemetry',
          desc: 'Heavy-lift aerial shoots, flight permits, and 8K gimbal passes',
          addBtn: 'Log Flight Mission',
          inputTitle: 'Aerial Flight Location / Scene',
          inputSub: 'Drone Rig & Sensor',
          inputTag: 'Permit & Flight Status'
        };
      case 'BOOM_OPERATOR':
        return {
          icon: Mic,
          label: 'Production Sound & Boom Tracking',
          desc: 'Directional mic setups, RF wireless channels, and dialogue passes',
          addBtn: 'Add Mic Track / Setup',
          inputTitle: 'Sound Track / Scene Slate',
          inputSub: 'Boom Mic Model & Placement',
          inputTag: 'Audio Quality'
        };
      case 'ASSISTANT_DIRECTOR':
        return {
          icon: Clock,
          label: '1st AD Call Sheets & Set Timekeeping',
          desc: 'On-set schedule tracking, crowd coordination, and camera calls',
          addBtn: 'Add Call Sheet Item',
          inputTitle: 'Call Sheet Block / Scene Call',
          inputSub: 'Department Call Time & Location',
          inputTag: 'Schedule Status'
        };
      default:
        return {
          icon: Layers,
          label: `${theme.title} Studio Station`,
          desc: 'Specialized craft workbench and active film collaborations',
          addBtn: 'Add Project / Asset',
          inputTitle: 'Title',
          inputSub: 'Description',
          inputTag: 'Status'
        };
    }
  };

  const meta = getRoleMeta();
  const Icon = meta.icon;

  return (
    <div className="rounded-3xl bg-[#111218]/90 border border-white/10 p-6 space-y-5 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-3">
        <div className="flex items-center space-x-3">
          <div
            className="p-2.5 rounded-xl border"
            style={{
              backgroundColor: `${theme.primaryColor}20`,
              borderColor: `${theme.primaryColor}40`,
              color: theme.accentColor
            }}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-cinematic font-bold text-white">{meta.label}</h3>
            <p className="text-xs text-gray-400">{meta.desc}</p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 self-start sm:self-auto transition-all"
          style={{
            backgroundColor: `${theme.primaryColor}30`,
            color: theme.accentColor,
            border: `1px solid ${theme.primaryColor}50`
          }}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAdding ? 'Cancel' : meta.addBtn}</span>
        </button>
      </div>

      {/* Add New Item Form */}
      {isAdding && (
        <form onSubmit={handleAddItem} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 animate-in fade-in duration-200">
          <div className="text-xs font-cinematic font-bold text-amber-300 uppercase tracking-wider">
            {meta.addBtn}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder={meta.inputTitle}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            />
            <input
              type="text"
              placeholder={meta.inputSub}
              value={newSubtitle}
              onChange={(e) => setNewSubtitle(e.target.value)}
              className="px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            />
            <input
              type="text"
              placeholder={meta.inputTag}
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl text-xs font-bold uppercase bg-amber-500 text-black shadow-glow-gold hover:bg-amber-400 transition-colors"
            >
              Save to Console
            </button>
          </div>
        </form>
      )}

      {/* Item List or Clean Empty State */}
      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map(item => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between hover:border-white/15 transition-all"
            >
              <div>
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
                <div className="text-xs text-gray-400 mt-0.5">{item.subtitle}</div>
              </div>

              <div className="flex items-center space-x-3">
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full border role-tag-pill"
                  style={{
                    backgroundColor: `${theme.primaryColor}20`,
                    borderColor: `${theme.primaryColor}40`,
                    color: theme.accentColor
                  }}
                >
                  {item.tag}
                </span>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                  title="Remove Item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center rounded-2xl bg-black/30 border border-white/5 space-y-2">
          <Icon className="w-8 h-8 text-gray-600 mx-auto" />
          <div className="text-sm font-bold text-gray-300">Clean Console Ready</div>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Zero fake items. Click <strong className="text-gray-300">"{meta.addBtn}"</strong> above to add your real film projects, slates, scripts, or gear packages.
          </p>
        </div>
      )}
    </div>
  );
};
