import React, { useState } from 'react';
import { CheckCircle2, XCircle, Clock, Award, HelpCircle } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import api from '../../api/client';
import { useApp } from '../../context/AppContext';

const AssessmentModal = ({ isOpen, onClose, assessment, onCompleted }) => {
  const { student } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  if (!assessment) return null;

  const questions = assessment.questions || [];
  const currentQ = questions[currentIdx];

  const handleSelectOption = (option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: option,
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const answersPayload = Object.entries(selectedAnswers).map(([qId, opt]) => ({
        question_id: parseInt(qId),
        selected_option: opt,
      }));

      const res = await api.post('/assessments/submit', {
        student_id: student ? student.id : 1,
        assessment_id: assessment.id,
        answers: answersPayload,
      });

      setResult(res.data);
      if (onCompleted) onCompleted(res.data);
    } catch (err) {
      console.error('Failed to submit assessment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setResult(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title={result ? `Assessment Completed: ${assessment.title}` : assessment.title}
      maxWidth="max-w-2xl"
    >
      {result ? (
        // Results View
        <div className="space-y-5 text-xs">
          <div
            className={`p-5 rounded-2xl border text-center ${
              result.passed
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}
          >
            <div className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center bg-white shadow-sm">
              {result.passed ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              ) : (
                <Award className="w-8 h-8 text-amber-600" />
              )}
            </div>

            <h4 className="text-lg font-bold">
              {result.passed ? 'Assessment Passed with Distinction!' : 'Assessment Completed'}
            </h4>
            <p className="text-xs opacity-80 mt-1">
              You answered {result.score} out of {result.total_score} questions correctly.
            </p>

            <div className="mt-4 flex items-center justify-center gap-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-75 block">
                  Final Score
                </span>
                <span className="text-3xl font-black">{result.percentage}%</span>
              </div>
              <div className="h-8 w-px bg-current opacity-20" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-75 block">
                  Status
                </span>
                <span className="text-sm font-bold uppercase tracking-wider">
                  {result.passed ? 'QUALIFIED' : 'NEEDS PRACTICE'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 leading-relaxed">
            <span className="font-bold text-slate-800 block mb-1">Performance Insight</span>
            Your assessment score has been recorded in your placement profile history. Consistent practice on algorithmic and system design topics significantly boosts placement conversion rates.
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <Button variant="primary" size="sm" onClick={handleResetAndClose}>
              Done & Return to Skills
            </Button>
          </div>
        </div>
      ) : (
        // Question Test Taking View
        <div className="space-y-5 text-xs">
          {/* Progress bar and counter */}
          <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-slate-100">
            <span className="font-semibold text-slate-700">
              Question {currentIdx + 1} of {questions.length}
            </span>
            <div className="flex items-center gap-1.5 text-blue-600 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>{assessment.duration_minutes} Mins Duration</span>
            </div>
          </div>

          {currentQ && (
            <div>
              <h4 className="text-sm font-bold text-slate-900 leading-relaxed mb-4">
                {currentQ.question_text}
              </h4>

              <div className="space-y-2">
                {[
                  { key: 'A', text: currentQ.option_a },
                  { key: 'B', text: currentQ.option_b },
                  { key: 'C', text: currentQ.option_c },
                  { key: 'D', text: currentQ.option_d },
                ].map((opt) => {
                  const isSelected = selectedAnswers[currentQ.id] === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => handleSelectOption(opt.key)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-600 text-blue-900 font-semibold shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 border ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-slate-300 text-slate-500'
                        }`}
                      >
                        {opt.key}
                      </span>
                      <span className="leading-snug pt-0.5">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation & Submit footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {currentIdx < questions.length - 1 ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                >
                  Next Question
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  loading={submitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={handleSubmit}
                >
                  Submit Assessment
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default AssessmentModal;
