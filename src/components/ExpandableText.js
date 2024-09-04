import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ExpandableText = ({ text, maxLength = 100 }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    if (text.length <= maxLength) {
        return <span>{text}</span>;
    }

    return (
        <span>
            {isExpanded ? text : `${text.substring(0, maxLength)}...`}
            <button onClick={toggleExpansion} className="btn btn-link">
                {isExpanded ? 'See Less' : 'See More'}
            </button>
        </span>
    );
};

ExpandableText.propTypes = {
    text: PropTypes.string.isRequired,
    maxLength: PropTypes.number,
};

export default React.memo(ExpandableText);
