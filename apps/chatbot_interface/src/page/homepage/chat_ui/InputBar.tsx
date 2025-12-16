import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import icons from '../../../constants/icons';
import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import colors from '../../../constants/colors';

interface InputBarProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

const MAX_HEIGHT = 200;

const InputBar: React.FC<InputBarProps> = ({
    value,
    onChange,
    onSubmit,
    placeholder = 'Ask anything',
    disabled = false,
}) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [focused, setFocused] = useState(false);

    const bgColor = colors.colors.primary;

    const adjustHeight = () => {
        const el = textAreaRef.current;
        if (!el) return;

        el.style.height = 'auto';
        const newHeight = el.scrollHeight;

        if (newHeight <= MAX_HEIGHT) {
            el.style.height = newHeight + 'px';
            el.style.overflowY = 'hidden';
        } else {
            el.style.height = MAX_HEIGHT + 'px';
            el.style.overflowY = 'auto';
        }
    };

    useEffect(() => adjustHeight(), [value]);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
        adjustHeight();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (value.trim()) {
                onSubmit(value.trim());
            }
        }
    };

    const handleSubmit = () => {
        if (value.trim()) {
            onSubmit(value.trim());
        }
    };

    return (
        <div
            className={`w-full border rounded-xl shadow-sm bg-white px-3 py-2 ${focused ? 'border border-black' : 'border-gray-300'}`}
        >
            <div className="flex items-center gap-3">
                <textarea
                    ref={textAreaRef}
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={1}
                    className="
                            flex-1 bg-transparent resize-none
                            text-sm text-black placeholder:text-gray-500
                            focus:outline-none
                            leading-6
                        "
                    style={{
                        maxHeight: MAX_HEIGHT + 'px',
                    }}
                />

                <button
                    onClick={handleSubmit}
                    disabled={!value.trim() || disabled}
                    className={`
                            shrink-0 w-10 h-10 rounded-full 
                            flex items-center justify-center
                            transition-all duration-200
                            ${value.trim() && !disabled ? `bg-[${bgColor}]` : `bg-gray-300 cursor-not-allowed`}
                        `}
                >
                    <FontAwesomeIcon icon={icons.icon.send} />
                </button>
            </div>
        </div>
    );
};

export default InputBar;
