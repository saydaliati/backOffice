import { ComponentProps, forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputFieldProps extends ComponentProps<'input'> {
    label?: string;
    error?: string;
    startIcon?: LucideIcon;
    endIcon?: LucideIcon;
    isRTL?: boolean;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
    ({ label, error, startIcon: StartIcon, endIcon: EndIcon, isRTL = false, className = '', ...props }, ref) => {
        const baseInputStyles = `
            w-full rounded-lg border bg-white dark:bg-gray-800 outline-none
            px-4 py-2.5 text-gray-900 dark:text-gray-100
            placeholder:text-gray-500 dark:placeholder:text-gray-400
            focus:ring-1 focus:ring-primary transition-all
            ${error ? 'border-red-300' : 'border-gray-200 dark:border-gray-700'}
            ${StartIcon ? 'ltr:pl-10 rtl:pr-10' : ''} 
            ${EndIcon ? 'ltr:pr-10 rtl:pl-10' : ''}
            ${isRTL ? 'ltr:text-right rtl:text-left' : 'ltr:text-left rtl:text-right'}
            ${className}
        `;

        return (
            <div className="space-y-1.5">
                {label && (
                    <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ltr:text-left rtl:text-right`}>
                        {label}
                    </label>
                )}

                <div className="relative">
                    {StartIcon && (
                        <div className={`absolute inset-y-0 ltr:left-0 rtl:right-0 pl-3 rtl:pr-3 flex items-center pointer-events-none`}>
                            <StartIcon className={`w-5 h-5 ${error ? 'text-red-500' : 'text-primary'}`} />
                        </div>
                    )}

                    <input 
                        ref={ref} 
                        className={baseInputStyles} 
                        dir={isRTL ? 'rtl' : 'ltr'}
                        {...props} 
                    />

                    {EndIcon && (
                        <div className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center pointer-events-none`}>
                            <EndIcon className={`w-5 h-5 ${error ? 'text-red-500' : 'text-primary'}`} />
                        </div>
                    )}
                </div>

                {error && (
                    <p className={`text-sm text-red-500 dark:text-red-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

InputField.displayName = 'InputField';

export default InputField;