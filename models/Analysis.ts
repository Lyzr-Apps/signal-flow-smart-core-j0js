import { initDB, createModel } from 'lyzr-architect';
let _model: any = null;
export default async function getAnalysisModel() {
  if (!_model) {
    await initDB();
    _model = createModel('Analysis', {
      signal_id: { type: String },
      orchestrator_summary: { type: String },
      specialist_outputs: [{ type: Object }],
      signal_types: [{ type: String }],
      priority_actions: [{ type: Object }],
      cross_cutting_themes: { type: String }
    });
  }
  return _model;
}
