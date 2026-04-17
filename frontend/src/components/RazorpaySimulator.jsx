import { motion, AnimatePresence } from "framer-motion";
import { IndianRupee, CheckCircle2, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export default function RazorpaySimulator({ claim, onClose }) {
  const [stage, setStage] = useState("processing"); // processing -> success

  useEffect(() => {
    // Simulate network delay for processing payment
    const timer = setTimeout(() => {
      setStage("success");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 pb-10"
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#02042b] p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">R</span>
              </div>
              <span className="text-white font-bold text-sm">
                Razorpay Checkout
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              &times;
            </button>
          </div>

          <div className="p-6 sm:p-8 flex flex-col items-center text-center">
            {stage === "processing" ? (
              <div className="flex flex-col items-center py-6">
                <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                <h3 className="text-lg font-bold text-slate-800">
                  Processing UPI Transfer
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Connecting to bank...
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 10, stiffness: 100 }}
                className="flex flex-col items-center py-4"
              >
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  Payment Successful
                </h3>
                <div className="flex items-center gap-1 text-3xl font-black text-slate-900 mt-2 mb-1">
                  <IndianRupee className="w-6 h-6" />{" "}
                  {claim?.payoutAmount || "800"}
                </div>
                <p className="text-sm text-slate-500 font-medium">
                  Credited to primary UPI account
                </p>

                <div className="w-full bg-slate-50 rounded-xl p-4 mt-6 border border-slate-100 text-left">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-slate-500">From</span>
                    <span className="text-xs font-bold text-slate-800">
                      GigShield AI Org
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">Subject</span>
                    <span className="text-xs font-bold text-emerald-600 line-clamp-1 text-right max-w-[150px]">
                      Parametric Claim: {claim?.triggerEvent || "Auto"}
                    </span>
                  </div>
                </div>

                <div className="mt-8 flex flex-col items-center">
                  <div className="flex items-center gap-1 text-slate-400">
                    <ShieldCheck className="w-3 h-3" />
                    <span className="text-[10px] uppercase font-bold tracking-widest">
                      Secured by Razorpay
                    </span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  Done
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
