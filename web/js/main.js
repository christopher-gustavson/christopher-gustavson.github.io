tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#2563eb',
                secondary: '#9333ea',
                neutral: {
                    100: '#f3f4f6',
                    800: '#1f2937',
                    900: '#111827',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'bounce-slow': 'bounce 2s infinite'
            }
        }
    }
}