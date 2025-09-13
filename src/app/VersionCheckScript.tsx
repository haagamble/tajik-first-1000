'use client';

import { useEffect } from 'react';
import { initializeVersionCheck } from '../utils/versionCheck';

export function VersionCheckScript() {
    useEffect(() => {
        // Initialize version checking when the app loads
        initializeVersionCheck();
    }, []);

    return null; // This component doesn't render anything
}
