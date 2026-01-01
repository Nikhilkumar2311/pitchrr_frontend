/**
 * UserAvatar Component
 * 
 * Displays user profile image if available, else shows initials
 * with a random vibrant background color.
 */

interface UserAvatarProps {
    name?: string | null;
    imageUrl?: string | null;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const colors = [
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-rose-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-teal-500',
    'bg-emerald-500',
];

const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
};

export function UserAvatar({
    name,
    imageUrl,
    size = 'md',
    className = ''
}: UserAvatarProps) {

    // Get initials (up to 2 characters)
    const getInitials = () => {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    // Deterministic random color based on name string
    const getColorClass = () => {
        if (!name) return colors[0];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % colors.length;
        return colors[index];
    };

    if (imageUrl) {
        return (
            <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-100 ${className}`}>
                <img
                    src={imageUrl}
                    alt={name || 'User'}
                    className="w-full h-full object-cover"
                />
            </div>
        );
    }

    return (
        <div className={`
            ${sizeClasses[size]} 
            ${getColorClass()} 
            rounded-full flex items-center justify-center 
            text-white font-bold tracking-wider
            border-2 border-white shadow-sm ring-1 ring-gray-100
            ${className}
        `}>
            {getInitials()}
        </div>
    );
}
