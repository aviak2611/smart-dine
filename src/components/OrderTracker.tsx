"use client";

type Props = {
    status: string;
};

const steps = [
    "pending",
    "preparing",
    "out_for_delivery",
    "delivered",
];

export default function OrderTracker({ status }: Props) {
    const currentIndex = steps.indexOf(status);

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">

            <h2 className="text-lg font-bold mb-6 text-gray-900">
                                🚚 Track Your Order
            </h2>

            {/* STEP CONTAINER */}
            <div className="relative pl-6">

                {/* VERTICAL LINE */}
                <div className="absolute left-2 top-0 bottom-0 w-[2px] bg-gray-200" />

                {steps.map((step, index) => {
                    const isDone = index <= currentIndex;

                    return (
                        <div key={step} className="mb-6 relative flex items-center gap-3">

                            {/* DOT */}
                            <div
                                className={`w-4 h-4 rounded-full z-10 ${isDone ? "bg-green-500" : "bg-gray-400"
                                    }`}
                            />

                            <p
                                className={`capitalize font-medium ${isDone ? "text-green-700 font-semibold" : "text-gray-600"
                                    }`}
                            >
                                {step.replace("_", " ")}
                            </p>

                        </div>
                    );
                })}
            </div>
        </div>
    );
}