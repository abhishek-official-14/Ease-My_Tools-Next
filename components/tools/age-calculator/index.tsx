"use client";

import React, { useState } from "react";
import "./styles.css";

const AgeCalculator = () => {
    const [birthDate, setBirthDate] = useState("");
    const [age, setAge] = useState(null);

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
        <div className="age-calculator">
            <div className="calculator-header">
                <h1>Age Calculator</h1>
                <p>Calculate your exact age in years, months, and days</p>
            </div>

            <div className="calculator-container">
                <div className="input-section">
                    <label>Your Birth Date</label>
                    <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="date-input"
                        max={new Date().toISOString().split("T")[0]}
                    />
                </div>

                <div className="action-buttons">
                    <button onClick={calculateAge} className="calculate-btn">
                        Calculate Age
                    </button>
                    <button onClick={clearAll} className="clear-btn">
                        Clear
                    </button>
                </div>

                {age && (
                    <div className="results-section">
                        <h3>Your Age</h3>
                        <div className="age-display">
                            <div className="age-unit">
                                <span className="age-number">{age.years}</span>
                                <span className="age-label">Years</span>
                            </div>
                            <div className="age-unit">
                                <span className="age-number">{age.months}</span>
                                <span className="age-label">Months</span>
                            </div>
                            <div className="age-unit">
                                <span className="age-number">{age.days}</span>
                                <span className="age-label">Days</span>
                            </div>
                        </div>

                        <div className="additional-stats">
                            <div className="stat">
                                <span className="stat-label">Total Days:</span>
                                <span className="stat-value">
                                    {age.totalDays.toLocaleString()}
                                </span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Days until next birthday:</span>
                                <span className="stat-value">{age.daysUntilBirthday}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Birth Day:</span>
                                <span className="stat-value">{age.birthDayName}</span>
                            </div>
                        </div>

                        <div className="fun-facts">
                            <h4>Fun Facts</h4>
                            <ul>
                                <li>
                                    You have lived through approximately{" "}
                                    {Math.floor(age.totalDays / 30.44)} months
                                </li>
                                <li>
                                    You have experienced about {Math.floor(age.totalDays / 7)}{" "}
                                    weekends
                                </li>
                                <li>Your next birthday is in {age.daysUntilBirthday} days</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgeCalculator;
