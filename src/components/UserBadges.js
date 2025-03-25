import React from 'react';
import { Box, HStack, Image, Tooltip } from '@chakra-ui/react';

// Alapértelmezett ikon, ha egy badge-hez nincs ikon hozzárendelve
const defaultIcon = (
    <Image
        src="/images/shield-antivirus-svgrepo-com.svg"
        boxSize="20px"
        alt="Default badge icon"
    />
);

// Itt definiáljuk az egyes badge-ekhez tartozó ikonokat
const badgeIcons = {
    admin: (
        <Tooltip label="Admin" aria-label="Admin">
            <Image
                src="/images/shield-antivirus-svgrepo-com.svg"
                boxSize="25px"
                alt="Admin badge icon"
                mt={1.5}
            />
        </Tooltip>
    ),
    support: (
        <Tooltip label="Támogatás" aria-label="Tamogatas">
            <Image
                src="/images/customer-support-chat-svgrepo-com.svg"
                boxSize="35px"
                alt="Segitő badge ikon"
                mt={1.5}
            />
        </Tooltip>
    ),
    // További badge-eket itt adhatsz hozzá
};

const UserBadges = ({ profile }) => {
    // Ha nincs badges mező vagy üres string, nem jelenítünk meg semmit
    if (
        !profile.badges ||
        (typeof profile.badges === "string" && profile.badges.trim() === "")
    ) {
        return null;
    }

    let badges;
    if (Array.isArray(profile.badges)) {
        badges = profile.badges;
    } else if (typeof profile.badges === "string") {
        try {
            badges = JSON.parse(profile.badges);
        } catch (error) {
            console.error("Hiba a badges parse-olása közben:", error);
            badges = [];
        }
    } else {
        return null;
    }

    if (!badges || badges.length === 0) {
        return null;
    }

    // Ha az "admin" badge létezik, tesszük az elejére (csak egyszer jelenik meg)
    if (badges.includes("admin")) {
        badges = ["admin", ...badges.filter((badge) => badge !== "admin")];
    }

    return (
        <HStack spacing={1}>
            {badges.map((badge, index) => (
                <Box key={`${badge}-${index}`}>
                    {badgeIcons[badge] ? badgeIcons[badge] : defaultIcon}
                </Box>
            ))}
        </HStack>
    );
};

export default UserBadges;
