import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";

export default function SearchBar() {
    const inputRef = useRef(null);
    const [listening, setListening] = useState(false);

    const startListening = () => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Your browser does not support speech recognition.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.continuous = false;

        setListening(true);
        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            inputRef.current.value = transcript;
        };

        recognition.onerror = () => setListening(false);
        recognition.onend = () => setListening(false);
    };

    return (
        <div className="flex justify-center items-center gap-12">

            <div className="flex items-center bg-(--bg-main) border-2 border-(--color-brand) rounded-xl px-4 py-1 w-60 shadow-sm">

                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search Service"
                    className="flex-1 bg-transparent outline-none text-(--text-primary) placeholder-(--text-secondary)"
                />

                <FontAwesomeIcon
                    icon={faMicrophone}
                    onClick={startListening}
                    className={`cursor-pointer transition-all duration-300 ${listening ? "text-red-500 animate-pulse" : "text-(--text-secondary)"
                        }`}
                    style={{ fontSize: "18px" }}
                />
            </div>
        </div>
    );
}

