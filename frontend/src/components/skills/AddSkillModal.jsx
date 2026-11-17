import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const CATEGORIES = [
  'Programming',
  'Web Development',
  'Database',
  'Data Science',
  'Soft Skills',
];

const PROFICIENCIES = ['Beginner', 'Intermediate', 'Advanced'];

const AddSkillModal = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Programming');
  const [proficiency, setProficiency] = useState('Intermediate');
  const [score, setScore] = useState(75);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      await onAdd({
        name: name.trim(),
        category,
        proficiency,
        score: parseFloat(score),
      });
      setName('');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Technical Skill" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="font-semibold text-slate-700 block mb-1">Skill Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Docker, TypeScript, PyTorch"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">Proficiency Level *</label>
          <div className="grid grid-cols-3 gap-2">
            {PROFICIENCIES.map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => {
                  setProficiency(lvl);
                  if (lvl === 'Beginner') setScore(50);
                  if (lvl === 'Intermediate') setScore(75);
                  if (lvl === 'Advanced') setScore(90);
                }}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                  proficiency === lvl
                    ? 'bg-blue-50 border-blue-600 text-blue-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-semibold text-slate-700">Estimated Confidence Score</label>
            <span className="font-bold text-blue-600">{score}%</span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" loading={loading}>
            Add Skill
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddSkillModal;
