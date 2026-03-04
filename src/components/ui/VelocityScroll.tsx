/**
 * VelocityScroll Component
 * Horizontal marquee text whose speed responds to scroll velocity.
 * Uses Framer Motion for scroll-velocity-driven kinetic movement.
 */

import { useRef, useEffect, useState } from "react";
import {
    motion,
    useAnimationFrame,
    useMotionValue,
    useScroll,
    useSpring,
    useTransform,
    useVelocity,
} from "framer-motion";

function wrap(min: number, max: number, v: number) {
    const range = max - min;
    const mod = ((((v - min) % range) + range) % range) + min;
    return mod;
}

interface VelocityScrollProps {
    children: string;
    baseVelocity?: number;
    className?: string;
}

export function VelocityScroll({
    children,
    baseVelocity = -2,
    className = "",
}: VelocityScrollProps) {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400,
    });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
        clamp: false,
    });

    const [repetitions, setRepetitions] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const calculateRepetitions = () => {
            if (containerRef.current && textRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const textWidth = textRef.current.offsetWidth;
                const reps = Math.ceil(containerWidth / textWidth) + 2;
                setRepetitions(reps);
            }
        };

        calculateRepetitions();

        window.addEventListener("resize", calculateRepetitions);
        return () => window.removeEventListener("resize", calculateRepetitions);
    }, [children]);

    const x = useTransform(baseX, (v) => {
        if (!textRef.current) return "0%";
        return `${wrap(-100 / repetitions, 0, v)}%`;
    });

    const directionFactor = useRef<number>(1);

    useAnimationFrame((_, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

        if (velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get();
        baseX.set(baseX.get() + moveBy);
    });

    return (
        <div
            className="velocity-scroll-wrapper"
            ref={containerRef}
        >
            <motion.div
                className="velocity-scroll-track"
                style={{ x }}
            >
                {Array.from({ length: repetitions }).map((_, i) => (
                    <span
                        key={i}
                        className={`velocity-scroll-text ${className}`}
                        ref={i === 0 ? textRef : undefined}
                    >
                        {children}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}
