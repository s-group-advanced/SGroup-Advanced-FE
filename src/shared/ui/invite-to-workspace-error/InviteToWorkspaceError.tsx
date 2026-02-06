import { useSearchParams, Link } from 'react-router-dom';
import { AlertCircle, XCircle, CheckCircle, Home } from 'lucide-react';

export function InviteToWorkspaceError() {
  const [searchParams] = useSearchParams();
  const errorType = searchParams.get('type') || 'general';
  const message = searchParams.get('message') || 'An error occurred';

  const errorConfig = {
    expired: {
      icon: <AlertCircle className="w-16 h-16 text-yellow-500" />,
      title: 'Invitation Link Expired',
      description: 'This invitation link is no longer valid.',
      action: 'Please contact the workspace owner to request a new invitation link.',
      color: 'yellow',
    },
    not_found: {
      icon: <XCircle className="w-16 h-16 text-red-500" />,
      title: 'Workspace Not Found',
      description: 'The workspace you are trying to join does not exist.',
      action: 'It may have been deleted or archived.',
      color: 'red',
    },
    already_member: {
      icon: <CheckCircle className="w-16 h-16 text-green-500" />,
      title: 'Already a Member',
      description: 'You are already a member of this workspace.',
      action: 'Go to your workspaces to access it.',
      color: 'green',
    },
    general: {
      icon: <XCircle className="w-16 h-16 text-red-500" />,
      title: 'Unable to Join Workspace',
      description: message,
      action: 'Please try again or contact support.',
      color: 'red',
    },
  };

  const config = errorConfig[errorType as keyof typeof errorConfig] || errorConfig.general;

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1E1E1E] rounded-lg p-8 text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          {config.icon}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-white">
          {config.title}
        </h1>

        {/* Description */}
        <p className="text-gray-400">
          {config.description}
        </p>

        {/* Action hint */}
        <p className="text-sm text-gray-500">
          {config.action}
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3 mt-6">
          {errorType === 'already_member' && (
            <Link
              to="/workspaces"
              className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Go to Workspaces
            </Link>
          )}
          
          <Link
            to="/home"
            className="bg-[#2A2A2A] text-white px-6 py-3 rounded-lg hover:bg-[#353535] transition-colors font-medium inline-flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go to Home
          </Link>
        </div>

        {/* Contact support */}
        {errorType === 'expired' && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-sm text-gray-500">
              Need help?{' '}
              <a href="mailto:support@yourapp.com" className="text-blue-400 hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}