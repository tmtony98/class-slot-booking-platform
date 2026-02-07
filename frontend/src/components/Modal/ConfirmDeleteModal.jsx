export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-5 backdrop-blur-[4px]">
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-[400px] w-full shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        <h2 className="text-center text-[#333] text-xl mb-2 font-semibold">Delete Booking</h2>
        <p className="text-center text-[#666] text-sm mb-6">
          Are you sure you want to delete this booking?
        </p>

        <div className="flex justify-center gap-4">
          <button
            className="py-3 px-8 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-white border-2 border-[#e0e0e0] text-[#666] hover:border-[#333] hover:text-[#333]"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="py-3 px-8 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-error border-2 border-error text-white hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
