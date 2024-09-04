import React, { useState } from 'react';
import DateTime from 'react-datetime';
import moment from 'moment';
import 'react-datetime/css/react-datetime.css';

const DateChooser = ({ onChange }) => {
    const [date, setDate] = useState(null);

    const handleDateChange = (selectedDate) => {
        const formattedDate = moment(selectedDate).format('YYYY-MM-DD HH:mm:ss');
        setDate(formattedDate);
        if (onChange) {
            onChange(formattedDate);
        }
    };

    return (
        <div>
            <DateTime
                onChange={handleDateChange}
                dateFormat="YYYY-MM-DD"
                timeFormat="HH:mm:ss"
                inputProps={{ placeholder: 'Select Date and Time' }}
            />
            {date && <div>Selected Date: {date}</div>}
        </div>
    );
};

export default DateChooser;
