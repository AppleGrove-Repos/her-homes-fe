'use client';
import React, { InputHTMLAttributes, LabelHTMLAttributes } from 'react';

interface Option {
	label: string;
	value: string;
}

interface RadioFieldProps {
	label?: string;
	options: Option[];
	disabled?: boolean;
	LabelProps?: LabelHTMLAttributes<HTMLLabelElement>;
	InputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;
	helperText?: string;
	className?: string;
}

export default function RadioField({
	label,
	options,
	disabled = false,
	LabelProps,
	InputProps,
	helperText,
	className,
}: RadioFieldProps) {
	return (
		<div className={`flex gap-1 flex-col w-full ${className}`}>
			{label && (
				<label
					{...LabelProps}
					className={`sm:text-[.85rem] text-[0.7rem] ${LabelProps?.className} flex items-center`}>
					{label}
					{InputProps?.required && <span className="text-red-600 pb-[.1rem] ml-1 text-[1.2rem]">*</span>}
				</label>
			)}

			<div className="flex gap-4 flex-wrap">
				{options.map((option) => (
					<label key={option.value} className="flex items-center gap-2 cursor-pointer">
						<input
							{...InputProps}
							type="radio"
							value={option.value}
							disabled={disabled}
							className={`w-4 h-4 accent-primary cursor-pointer disabled:cursor-not-allowed ${InputProps?.className}`}
						/>
						<span className="text-[.8rem] text-black">{option.label}</span>
					</label>
				))}
			</div>

			{helperText && (
				<p className="pl-2 text-red-500 text-[.8rem] transition-all duration-300">{helperText}</p>
			)}
		</div>
	);
}
