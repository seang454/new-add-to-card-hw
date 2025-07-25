// This makes Redux available to all components in our app
"use client";

import React from 'react';
import { persistor, store } from "./store"
import { PersistGate } from "redux-persist/integration/react"
import { Provider } from 'react-redux';

// This component wraps our entire app and provides Redux store to all children
export function Providers({ children }: { children: React.ReactNode }) {
    // Only use PersistGate on the client side
    const [isClient, setIsClient] = React.useState(false);
    React.useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        // During SSR or first render, just provide the store
        return <Provider store={store}>{children}</Provider>;
    }

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
}

// HOW THIS WORKS:
// 1. We wrap our app with this Providers component
// 2. The Provider gives all child components access to the Redux store
// 3. Any component can now use useAppSelector to read data
// 4. Any component can now use useAppDispatch to send actions