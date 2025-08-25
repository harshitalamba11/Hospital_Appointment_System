import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";

const Appointments = () => {
    const { docId } = useParams();
    const { doctors, currencySymbol } = useContext(AppContext);
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const [docInfo, setDocInfo] = useState(null);
    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');
    // For matching heights
    const infoRef = useRef(null);
    const [imgHeight, setImgHeight] = useState(320);

    useEffect(() => {
        const doc = doctors.find(doc => doc._id === docId);
        setDocInfo(doc);
    }, [doctors, docId]);

    useEffect(() => {
        if (!docInfo) return;
        setDocSlots([]);
        let today = new Date();
        for (let i = 0; i < 7; i++) {
            let currntDate = new Date(today);
            currntDate.setDate(today.getDate() + i);
            let endTime = new Date(currntDate);
            endTime.setHours(21, 0, 0, 0);

            if (today.getDate() === currntDate.getDate()) {
                currntDate.setHours(currntDate.getHours() > 10 ? currntDate.getHours() + 1 : 10);
                currntDate.setMinutes(currntDate.getMinutes() > 30 ? 30 : 0);
            } else {
                currntDate.setHours(10);
                currntDate.setMinutes(0);
            }

            let timeSlots = [];
            while (currntDate < endTime) {
                let formatedTime = currntDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                timeSlots.push({
                    datetime: new Date(currntDate),
                    time: formatedTime
                });
                currntDate.setMinutes(currntDate.getMinutes() + 30);
            }
            setDocSlots(prev => ([...prev, timeSlots]));
        }
    }, [docInfo]);

    // Set image container height to match info card
    useEffect(() => {
        if (infoRef.current) {
            setImgHeight(infoRef.current.offsetHeight);
        }
    }, [docInfo, infoRef.current]);

    return docInfo && (
        <div className="max-w-5xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8 items-start mt-8">
                {/* Image */}
                <div
                    className="w-44 md:w-64 bg-primary rounded-xl flex items-center justify-center shadow"
                    style={{ height: imgHeight }}
                >
                    <img
                        className="w-full h-full object-cover rounded-lg border-4 border-white shadow"
                        src={docInfo.image}
                        alt={docInfo.name}
                    />
                </div>
                {/* Info Card */}
                <div
                    ref={infoRef}
                    className="flex-1 border border-gray-300 rounded-xl p-8 bg-white flex flex-col gap-2 shadow"
                >
                    <p className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
                        {docInfo.name}
                        <img className="w-5" src={assets.verified_icon} alt="verified" />
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{docInfo.degree} - {docInfo.speciality}</span>
                        <span className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experience}</span>
                    </div>
                    <div>
                        <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                            About <img src={assets.info_icon} alt="info" />
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{docInfo.about}</p>
                    </div>
                    <p className="text-gray-500 font-medium mt-4">
                        Appointment fee: <span className="text-gray-600">{currencySymbol}{docInfo.fees}</span>
                    </p>
                </div>
            </div>
            {/* Booking Slots */}
            <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
                <p>Booking slots</p>
                <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
                    {docSlots.length > 0 && docSlots.map((item, index) => (
                        <div
                            onClick={() => setSlotIndex(index)}
                            className={`text-center py-4 px-4 min-w-16 rounded-full cursor-pointer
                                ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-202'}
                            `}
                            key={index}
                        >
                            <p className="font-semibold">{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                            <p>{item[0] && item[0].datetime.getDate()}</p>
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
                    {docSlots.length && docSlots[slotIndex].map((item,index)=>(
                        <p onClick={()=> setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time=== slotTime ? 'bg-primary text-white': 'text-gray-400 border border-gray-300'}`} key={index}>
                            {item.time.toLowerCase()}
                        </p>
                    ))}
                </div>
                <button className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6">Book an appointment</button>
            </div>
            {/* listing related doctors */}
            <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
        </div>
    );
};

export default Appointments;