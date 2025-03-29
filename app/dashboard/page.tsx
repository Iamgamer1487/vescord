'use client';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';
import { getMessages, createMessage } from '@/backend/prisma'; // Make sure this function is correctly set up to fetch messages
import Link from 'next/link';

export default function Dashboard() {
    const { user, error, isLoading } = useUser();
    const [message, setMessage] = useState(''); // Initialize state with empty string
    const [messages, setMessages] = useState<string[]>([]); // State to store messages
    const [fetchError, setFetchError] = useState<string | null>(null); // State for fetch errors

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const msgs = await getMessages(); // Fetch messages from your backend
                //@ts-expect-error
                setMessages(msgs); // Set the fetched messages in state
                setFetchError(null); // Clear any previous errors
            } catch (error) {
                console.error('Error fetching messages:', error);
                setFetchError('Failed to load messages. Please try again.');
            }
        };

        if (user) {
            fetchMessages();
        }
    }, [user]); // Run effect only when the user is present

    const handleSendMessage = () => {
        if (message.trim()) {
            //@ts-expect-error
           createMessage(message, user?.name, user?.email)
        } else {
            alert('Please enter a message!');
        }
    };

    if (isLoading) return <div className="text-center text-xl">Loading...</div>;
    if (error) return <div className="text-center text-xl text-red-600">{error.message}</div>;

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100 text-center">
                <div className="p-6 bg-black shadow-lg rounded-lg max-w-md w-full">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Please Sign In</h2>
                    <p className="text-gray-600">You must sign in to access this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-900">
            {/* Content at the top */}
            <div className="p-6 bg-blue-950 shadow-lg rounded-lg w-full text-center mb-6">
                <h1 className="text-3xl font-bold text-white mb-6">Welcome, {user.name}!</h1>

                <Link
                    href="/api/auth/logout"
                    className="px-8 py-4 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-300"
                >
                    Logout
                </Link>
            </div>

            {/* Displaying messages */}
            <div className="p-6 bg-blue-950 shadow-lg rounded-lg w-full mb-6">
                <h2 className="text-2xl font-semibold text-white mb-4">Messages</h2>
                <div className="space-y-4 bg-gray-800 shadow-lg rounded-lg w-full my-8 p-5">
                    {messages.map((msg: any, index: number) => (
                        <div key={msg.id} className='mb-4'>

                            <p className="text-white font-bold text-2xl">{msg!.userName}</p>

                        <p  className="text-white text-xl">{msg!.message}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Error handling for fetch */}
            {fetchError && (
                <div className="text-center text-xl text-red-600">{fetchError}</div>
            )}

            {/* Discord-like input field */}
            <div className="flex justify-center items-center flex-grow">
                <div className="p-6 bg-black shadow-lg rounded-lg max-w-md w-full text-center">
                    <div className="mt-6">
                        <input
                            type="text"
                            placeholder="Enter message..."
                            value={message} // Controlled input
                            onChange={(e) => setMessage(e.target.value)} // Update state on input change
                            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                        />
                    </div>
                </div>
                <button
                    onClick={handleSendMessage} // Trigger send action
                    className="mt-4 px-8 py-4 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
