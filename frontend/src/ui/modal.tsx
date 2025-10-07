import React from "react";

type ModalProps = {
	open: boolean;
	title?: string;
	message?: React.ReactNode;
	confirmText?: string;
	cancelText?: string;
	onClose: () => void;
	onConfirm?: () => void;
};

const Modal = ({
	open,
	title,
	message,
	confirmText = "OK",
	cancelText = "Fechar",
	onClose,
	onConfirm,
}: ModalProps) => {
	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/50" onClick={onClose} />

			<div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-lg w-full mx-4 p-6">
				{title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
				<div className="text-sm text-slate-700 dark:text-slate-300 mb-4">{message}</div>

				<div className="flex justify-end gap-2">
					<button
						className="px-3 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200"
						onClick={onClose}
					>
						{cancelText}
					</button>

					{onConfirm ? (
						<button
							className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
							onClick={() => {
								onConfirm();
								onClose();
							}}
						>
							{confirmText}
						</button>
					) : (
						<button
							className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
							onClick={onClose}
						>
							{confirmText}
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default Modal;
