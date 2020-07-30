const moment = require("moment");

module.exports = user => {
    const items = [
        ["Nickname", user.nickname],
        ["XP", user.xp.total.toString()],
        ["User since", moment(user.createdAt).format("LL")]
    ];
    const height = Math.max(45 + (items.length + 1) * 20, 150);

    return `
        <svg
            width="495"
            height="${height}"
            viewBox="0 0 495 ${height}"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="0.5"
                y="0.5"
                width="494"
                height="99%"
                rx="4.5"
                fill="#FFFFFF"
                stroke="#E4E2E2"
            />
            <text x="25" y="35">
                <tspan class="name">${encodeHTML(user.name)}</tspan>
                <tspan class="tag">#${user.tag}</tspan>
            </text>
            <g>
                <g transform="translate(400, ${height / 1.85})">
                    <circle class="rank-circle-rim" cx="-10" cy="8" r="40" />
                    <circle class="rank-circle" cx="-10" cy="8" r="40" />
                    <g class="rank-text">
                        <text
                            x="-4"
                            y="0"
                            alignment-baseline="central"
                            dominant-baseline="central"
                            text-anchor="middle"
                        >
                            ${user.xp.level}
                        </text>
                    </g>
                </g>
                <svg x="0" y="55">
                    ${items.map((item, i) =>`
                        <g class="stagger" style="animation-delay: ${(i + 3) * 150}ms" transform="translate(25, ${20 * i})">
                            <text class="stat bold" y="12.5">${item[0]}:</text>
                            <text class="stat" x="135" y="12.5">${encodeHTML(item[1])}</text>
                        </g>
                    `).join("")}
                </svg>
            </g>

            <style>
                .name {
                    font: 600 18px "Segoe UI", Ubuntu, Sans-Serif;
                    fill: #23529f;
                    fill-opacity: 0;
                    animation: fadeIn 0.8s ease-in-out forwards;
                }

                .tag {
                    font: 400 12px "Segoe UI", Ubuntu, Sans-Serif;
                    fill: #23529f;
                    display: inline-block;
                    fill-opacity: 0;
                    animation: fadeIn 0.8s ease-in-out 1s forwards;
                }

                .stat { 
                    font: 400 14px "Segoe UI", Ubuntu, "Helvetica Neue", Sans-Serif;
                    fill: #333;
                }
                
                .stagger { 
                    fill-opacity: 0;
                    animation: fadeIn 0.3s ease-in-out forwards;
                }

                .rank-text { 
                    font: 800 24px "Segoe UI", Ubuntu, Sans-Serif;
                    fill: #333;
                    animation: scaleIn 0.3s ease-in-out forwards;
                }

                .bold {
                    font-weight: 700
                }
                
                .icon {
                    fill: #4c71f2;
                    display: none;
                }

                .rank-circle-rim {
                    stroke: #23529f;
                    fill: none;
                    stroke-width: 6;
                    opacity: 0.2;
                }

                .rank-circle {
                    stroke: #23529f;
                    stroke-dasharray: 250;
                    fill: none;
                    stroke-width: 6;
                    stroke-linecap: round;
                    opacity: 0.8;
                    transform-origin: -10px 8px;
                    transform: rotate(-90deg);
                    animation: rankAnimation 1s forwards ease-in-out;
                }

                /* Animations */
                @keyframes scaleIn {
                    from {
                        transform: translate(-5px, 5px) scale(0);
                    }
                    
                    to {
                        transform: translate(-5px, 5px) scale(1);
                    }
                }

                @keyframes fadeIn {
                    from {
                        fill-opacity: 0;
                    }

                    to {
                        fill-opacity: 1;
                    }
                }

                @keyframes rankAnimation {
                    from {
                        stroke-dashoffset: ${calculateCircleProgress(0)};
                    }

                    to {
                        stroke-dashoffset: ${calculateCircleProgress(user.xp.levelProgress * 100)};
                    }
                }
            </style>
        </svg>
    `;
};

const calculateCircleProgress = value => {
    let radius = 40;
    let c = Math.PI * (radius * 2);
    if (value < 0) value = 0;
    if (value > 100) value = 100;
    return ((100 - value) / 100) * c;
};

const encodeHTML = str => str
    .replace(/[\u00A0-\u9999<>&](?!#)/gim, i => "&#" + i.charCodeAt(0) + ";")
    .replace(/\u0008/gim, "");