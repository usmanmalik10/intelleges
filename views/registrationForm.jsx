import React, { useState } from 'react';

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const { name, email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        const res = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        const data = await res.json();
        console.log(data.message);
    };

    return (
        <form onSubmit={onSubmit}>
            <input type="text" name="name" value={name} onChange={onChange} placeholder="Name" required />
            <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" required />
            <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
            <button type="submit">Register</button>
        </form>
    );
};

export default RegistrationForm;
