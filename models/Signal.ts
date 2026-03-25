import { initDB, createModel } from 'lyzr-architect';
let _model: any = null;
export default async function getSignalModel() {
  if (!_model) {
    await initDB();
    _model = createModel('Signal', {
      input_text: { type: String },
      structured_fields: { type: Object },
      signal_types: [{ type: String }],
      status: { type: String, default: 'pending' }
    });
  }
  return _model;
}
