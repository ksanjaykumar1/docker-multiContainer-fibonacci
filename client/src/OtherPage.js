import React from 'react'
import {Link} from 'react-router-dom'

export default function OtherPage() {
    return (
        <div>
            I'm some other page!
            <Link to='/'>GO back home</Link>
        </div>
    )
}
