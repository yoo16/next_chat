import React from 'react'

const stamps = [
    'stamp1.png', 'stamp2.png', 'stamp3.png', 'stamp4.png', 'stamp5.png', 'stamp6.png',
]

export const StampList = (props) => {
    return (
        <>
            {stamps.map((image, index) => {
                return (
                    <div key={index}>
                        <img
                            onClick={(e) => { props.sendStamp(e.target.src) }}
                            src={`/images/stamp/${image}`}
                        />
                    </div>
                )
            })}
        </>
    )
}