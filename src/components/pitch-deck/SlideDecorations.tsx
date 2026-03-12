/**
 * SlideDecorations Component
 * 
 * Renders theme-specific decorative elements for pitch deck slide previews.
 * Each theme gets unique shapes, patterns, and accent positions.
 */

interface SlideDecorationsProps {
    themeName: string;
    accentColor: string;
    isTitleSlide?: boolean;
}

export function SlideDecorations({ themeName, accentColor, isTitleSlide }: SlideDecorationsProps) {
    const name = (themeName || '').toLowerCase();

    // Dark / Midnight: Side accent bar + triangle corner + glow
    if (name === 'dark' || name === 'midnight') {
        return (
            <>
                {/* Left accent bar */}
                <div className="absolute top-0 left-0 w-1 h-full" style={{ background: accentColor }} />
                {/* Top-right triangle */}
                <div
                    className="absolute -top-10 -right-10 w-40 h-40 opacity-[0.08]"
                    style={{
                        background: accentColor,
                        clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
                    }}
                />
                {/* Bottom-left glow */}
                <div
                    className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full opacity-[0.04]"
                    style={{ background: accentColor }}
                />
            </>
        );
    }

    // Gradient Blue / Ocean / Warm Sunset: Bold bar + right stripe + floating circles
    if (name.includes('gradient') || name === 'ocean' || name === 'warm sunset') {
        return (
            <>
                {/* Top bar */}
                <div className="absolute top-0 left-0 w-full h-1.5 opacity-60" style={{ background: accentColor }} />
                {/* Right stripe */}
                <div className="absolute top-0 right-0 w-1 h-full opacity-30" style={{ background: accentColor }} />
                {/* Top-right circle */}
                <div
                    className="absolute -top-10 -right-10 w-36 h-36 rounded-full opacity-[0.08]"
                    style={{ background: accentColor }}
                />
                {/* Bottom-left circle */}
                <div
                    className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full opacity-[0.05]"
                    style={{ background: accentColor }}
                />
            </>
        );
    }

    // Corporate Green: Top bar + bottom strip + rounded corner block
    if (name === 'corporate green') {
        return (
            <>
                {/* Top bar */}
                <div className="absolute top-0 left-0 w-full h-1" style={{ background: accentColor }} />
                {/* Bottom strip */}
                <div className="absolute bottom-0 left-0 w-full h-2 opacity-20" style={{ background: accentColor }} />
                {/* Top-right rounded block */}
                <div
                    className="absolute -top-6 -right-6 w-28 h-28 rounded-2xl opacity-[0.06]"
                    style={{ background: accentColor }}
                />
            </>
        );
    }

    // Startup Orange: Top + left accent bars + corner circle
    if (name === 'startup orange') {
        return (
            <>
                {/* Top bar */}
                <div className="absolute top-0 left-0 w-full h-1" style={{ background: accentColor }} />
                {/* Left bar */}
                <div className="absolute top-0 left-0 w-1 h-full opacity-40" style={{ background: accentColor }} />
                {/* Top-right circle */}
                <div
                    className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-[0.07]"
                    style={{ background: accentColor }}
                />
            </>
        );
    }

    // Rose: Petal circles + accent bar
    if (name === 'rose') {
        return (
            <>
                {/* Top bar */}
                <div className="absolute top-0 left-0 w-full h-1" style={{ background: accentColor }} />
                {/* Large top-right petal */}
                <div
                    className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-[0.07]"
                    style={{ background: accentColor }}
                />
                {/* Bottom-left petal */}
                <div
                    className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full opacity-[0.05]"
                    style={{ background: accentColor }}
                />
                {/* Extra petal on title slide */}
                {isTitleSlide && (
                    <div
                        className="absolute bottom-4 right-6 w-20 h-20 rounded-full opacity-[0.04]"
                        style={{ background: accentColor }}
                    />
                )}
            </>
        );
    }

    // Minimal: Clean thin border frame + hairline top
    if (name === 'minimal') {
        return (
            <>
                {/* Thin top line */}
                <div className="absolute top-0 left-0 w-full" style={{ height: '2px', background: '#737373' }} />
                {/* Inset border frame */}
                <div
                    className="absolute inset-2 pointer-events-none"
                    style={{ border: '1px solid #D4D4D4', borderRadius: '4px' }}
                />
            </>
        );
    }

    // Light / default: Circles + accent bar (original design)
    return (
        <>
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 w-full h-1" style={{ background: accentColor, opacity: 0.6 }} />
            {/* Top-right circle */}
            <div
                className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10"
                style={{ background: accentColor }}
            />
            {/* Bottom-left circle */}
            <div
                className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-[0.07]"
                style={{ background: accentColor }}
            />
        </>
    );
}
