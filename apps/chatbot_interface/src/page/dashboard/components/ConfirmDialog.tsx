/* eslint-disable @typescript-eslint/no-explicit-any */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import icons from '../../../constants/icons';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmButtonClass?: string;
    icon?: any;
    iconBgColor?: string;
    iconColor?: string;
    previewContent?: {
        label: string;
        value: string | string[];
    };
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmButtonClass = 'bg-primary hover:bg-red-700',
    icon = icons.icon.questionCircle,
    iconBgColor = 'bg-red-100',
    iconColor = 'text-primary',
    previewContent,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    const previewValue = Array.isArray(previewContent?.value) ? previewContent.value.join(', ') : previewContent?.value;
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-slideUp">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 ${iconBgColor} rounded-lg`}>
                            <FontAwesomeIcon icon={icon} className={`${iconColor} text-xl`} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-sm text-gray-600 mb-4">{message}</p>

                    {previewContent && (
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <p className="text-xs font-semibold text-gray-700 mb-1">{previewContent.label}</p>
                            <p
                                className="text-sm text-gray-800 wrap-break-words whitespace-normal"
                                title={previewValue}
                            >
                                {previewValue}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 flex gap-3">
                    <button onClick={onCancel} className="btn btn-soft bg-white text-black flex-1 hover:bg-gray-100">
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`btn flex-1 text-white shadow-none border-none ${confirmButtonClass}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
