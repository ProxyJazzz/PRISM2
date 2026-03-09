import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { uploadProposal } from '../api/proposals';

interface UploadPortalProps {
  onUploadSuccess: (id: string) => void;
}

export default function UploadPortal({ onUploadSuccess }: UploadPortalProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setError('');
      setSuccess(false);
      setUploading(true);

      try {
        const data = await uploadProposal(file);
        setSuccess(true);
        setTimeout(() => onUploadSuccess(data.proposalId), 1500);
      } catch (err: any) {
        setError(err.message || 'Upload failed. Please try again.');
      } finally {
        setUploading(false);
      }
    },
    [onUploadSuccess]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div className="glass-panel rounded-2xl p-8">
      <h2 className="text-xl font-bold text-prism-text mb-2">Upload Research Proposal</h2>
      <p className="text-sm text-prism-text-muted mb-6">
        Upload a PDF document for AI-powered evaluation and analysis.
      </p>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-prism-accent bg-prism-accent/5 shadow-[0_0_30px_rgba(30,144,255,0.15)]'
            : 'border-prism-accent/20 hover:border-prism-accent/50 hover:bg-prism-accent/5'
        } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {uploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <Loader2 className="w-12 h-12 text-prism-accent animate-spin" />
              <p className="text-prism-text font-medium">Processing proposal...</p>
              <p className="text-sm text-prism-text-muted">
                AI evaluation in progress. This may take a moment.
              </p>
            </motion.div>
          ) : success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <CheckCircle className="w-12 h-12 text-green-400" />
              <p className="text-green-400 font-medium">Evaluation complete!</p>
              <p className="text-sm text-prism-text-muted">Redirecting to analysis...</p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="p-4 rounded-2xl bg-prism-accent/10 border border-prism-accent/20">
                {isDragActive ? (
                  <FileText className="w-10 h-10 text-prism-accent" />
                ) : (
                  <Upload className="w-10 h-10 text-prism-accent" />
                )}
              </div>
              <div>
                <p className="text-prism-text font-medium">
                  {isDragActive ? 'Drop your proposal here' : 'Drag & drop your proposal PDF'}
                </p>
                <p className="text-sm text-prism-text-muted mt-1">
                  or click to browse files (PDF only)
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </motion.div>
      )}
    </div>
  );
}
