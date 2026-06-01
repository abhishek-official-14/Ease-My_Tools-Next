"use client";

import React, { useState } from "react";

const AgeCalculator = () => {
    const [birthDate, setBirthDate] = useState("");
    const [age, setAge] = useState<any | null>(null);

    const calculateAge = () => {
        if (!birthDate) {
            alert("Please select your birth date");
            return;
        }

        const birth = new Date(birthDate);
        const today = new Date();

        let years = today.getFullYear() - birth.getFullYear();
        let months = today.getMonth() - birth.getMonth();
        let days = today.getDate() - birth.getDate();

        if (days < 0) {
            months--;
            const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += prevMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        const diffTime = today.getTime() - birth.getTime();
        const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        const nextBirthday = new Date(
            today.getFullYear(),
            birth.getMonth(),
            birth.getDate(),
        );
        if (nextBirthday < today) {
            nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
        }
        const daysUntilBirthday = Math.ceil(
            (nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );

        setAge({
            years,
            months,
            days,
            totalDays,
            daysUntilBirthday,
            birthDayName: birth.toLocaleDateString("en-US", { weekday: "long" }),
        });
    };

    const clearAll = () => {
        setBirthDate("");
        setAge(null);
    };

    return (
        <div className="flex justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-3 py-8 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100 sm:px-4 sm:py-10">
            <div className="w-full max-w-2xl">
                <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white/80 shadow-xl shadow-slate-200/40 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/80 dark:shadow-black/30">
                    <div className="p-5 sm:p-6">
                        {/* Input Section */}
                        <div className="mb-6">
                            <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                Your Birth Date
                            </label>
                            <input
                                type="date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                max={new Date().toISOString().split("T")[0]}
                                className="w-full rounded-lg border border-slate-200/80 bg-white/60 px-3 py-2 text-sm text-slate-800 transition focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 dark:border-slate-800/60 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:border-blue-500"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="mb-8 flex gap-3">
                            <button
                                onClick={calculateAge}
                                className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-xs font-bold tracking-wide text-white shadow-sm transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow active:scale-[0.98]"
                            >
                                Calculate Age
                            </button>
                            <button
                                onClick={clearAll}
                                className="rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                Clear
                            </button>
                        </div>

                        {/* Results */}
                        {age && (
                            <div className="space-y-5">
                                {/* Age Display Cards */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="rounded-lg border border-slate-200/80 bg-white/50 p-3 text-center shadow-sm dark:border-slate-800/60 dark:bg-slate-900/50">
                                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            {age.years}
                                        </div>
                                        <div className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                            Years
                                        </div>
                                    </div>
                                    <div className="rounded-lg border border-slate-200/80 bg-white/50 p-3 text-center shadow-sm dark:border-slate-800/60 dark:bg-slate-900/50">
                                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                            {age.months}
                                        </div>
                                        <div className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                            Months
                                        </div>
                                    </div>
                                    <div className="rounded-lg border border-slate-200/80 bg-white/50 p-3 text-center shadow-sm dark:border-slate-800/60 dark:bg-slate-900/50">
                                        <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                                            {age.days}
                                        </div>
                                        <div className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                            Days
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Stats */}
                                <div className="space-y-2 rounded-lg border border-slate-200/80 bg-white/60 p-4 dark:border-slate-800/60 dark:bg-slate-800/30">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-slate-500 dark:text-slate-400">
                                            Total Days:
                                        </span>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                                            {age.totalDays.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-slate-500 dark:text-slate-400">
                                            Days until next birthday:
                                        </span>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                                            {age.daysUntilBirthday}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-slate-500 dark:text-slate-400">
                                            Birth Day:
                                        </span>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                                            {age.birthDayName}
                                        </span>
                                    </div>
                                </div>

                                {/* Fun Facts */}
                                <div className="rounded-lg border border-dashed border-slate-300 bg-white/40 p-4 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/30">
                                    <h4 className="mb-2 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                        Fun Facts
                                    </h4>
                                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500">•</span>
                                            <span>You have lived through approximately {Math.floor(age.totalDays / 30.44)} months</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500">•</span>
                                            <span>You have experienced about {Math.floor(age.totalDays / 7)} weekends</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500">•</span>
                                            <span>Your next birthday is in {age.daysUntilBirthday} days</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgeCalculator;