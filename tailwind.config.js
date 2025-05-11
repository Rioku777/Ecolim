/** @type {import('tailwindcss').Config} */
    module.exports = {
      darkMode: ['class'],
      content: [
        './pages/**/*.{js,jsx}',
        './components/**/*.{js,jsx}',
        './app/**/*.{js,jsx}',
        './src/**/*.{js,jsx}',
      ],
      theme: {
        container: {
          center: true,
          padding: '2rem',
          screens: {
            '2xl': '1400px',
          },
        },
        extend: {
          colors: {
            border: 'hsl(var(--border))',
            input: 'hsl(var(--input))',
            ring: 'hsl(var(--ring))',
            background: 'hsl(var(--background))', 
            foreground: 'hsl(var(--foreground))',
            primary: {
              DEFAULT: 'hsl(var(--primary))',
              foreground: 'hsl(var(--primary-foreground))',
            },
            secondary: {
              DEFAULT: 'hsl(var(--secondary))',
              foreground: 'hsl(var(--secondary-foreground))',
            },
            destructive: {
              DEFAULT: 'hsl(var(--destructive))',
              foreground: 'hsl(var(--destructive-foreground))',
            },
            muted: {
              DEFAULT: 'hsl(var(--muted))',
              foreground: 'hsl(var(--muted-foreground))',
            },
            accent: {
              DEFAULT: 'hsl(var(--accent))',
              foreground: 'hsl(var(--accent-foreground))',
            },
            popover: {
              DEFAULT: 'hsl(var(--popover))',
              foreground: 'hsl(var(--popover-foreground))',
            },
            card: {
              DEFAULT: 'hsl(var(--card))',
              foreground: 'hsl(var(--card-foreground))',
            },
            'neumorphic-light': 'hsl(var(--neumorphic-light))',
            'neumorphic-dark': 'hsl(var(--neumorphic-dark))',
            'brand-green': 'hsl(var(--brand-green))',
            'brand-brown': 'hsl(var(--brand-brown))',
          },
          borderRadius: {
            lg: 'var(--radius)',
            md: 'calc(var(--radius) - 2px)',
            sm: 'calc(var(--radius) - 4px)',
            'neumorphic': '20px', 
          },
          boxShadow: {
            'neumorphic-concave': 'inset 6px 6px 12px hsl(var(--neumorphic-dark)), inset -6px -6px 12px hsl(var(--neumorphic-light))',
            'neumorphic-convex': '6px 6px 12px hsl(var(--neumorphic-dark)), -6px -6px 12px hsl(var(--neumorphic-light))',
            'neumorphic-flat': '3px 3px 6px hsl(var(--neumorphic-dark)), -3px -3px 6px hsl(var(--neumorphic-light))',
            'neumorphic-concave-focus': 'inset 4px 4px 8px hsl(var(--neumorphic-dark)), inset -4px -4px 8px hsl(var(--neumorphic-light)), 0 0 0 2px hsl(var(--primary))',
          },
          keyframes: {
            'accordion-down': {
              from: { height: 0 },
              to: { height: 'var(--radix-accordion-content-height)' },
            },
            'accordion-up': {
              from: { height: 'var(--radix-accordion-content-height)' },
              to: { height: 0 },
            },
             'pulse-soft': {
              '0%, 100%': { opacity: 1, transform: 'scale(1)' },
              '50%': { opacity: 0.7, transform: 'scale(1.05)' },
            },
          },
          animation: {
            'accordion-down': 'accordion-down 0.2s ease-out',
            'accordion-up': 'accordion-up 0.2s ease-out',
            'pulse-soft': 'pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          },
          fontFamily: {
            sans: ['"Poppins"', 'sans-serif'],
          },
        },
      },
      plugins: [require('tailwindcss-animate')],
    };