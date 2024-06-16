export const fadeUp = {
    initial: {
        opacity: 0,
        y: 50,
        rotate: 10,
    },
    animate: {
        opacity: 1,
        y: 0,
        rotate: 0
    },
};

export const fadeUpAndOut = {
    initial: {
        y: "100%",
    },
    animate: {
        y: ["0%", "-100%"],
        transition: {
            duration: 1.5,
            delay: 0.5,
            ease: "easeInOut",
        },

    },
};

export const fadeDown = {
    initial:{
        opacity: 0,
        y:-50,
    },
    animate:{
        opacity:1,
        y:0
    }
};

export const fadeLeft = {
    initial: {
        opacity: 0,
        x: 100,
    },
    animate: {
        opacity: 1,
        x: 0,
    },
};

export const fadeRight = {
    initial: {
        opacity: 0,
        x: -100,
    },
    animate: {
        opacity: 1,
        x: 0,
    },
};

export const fadeIn = {
    initial: {
        opacity: 0,
    },

    animate: {
        opacity: 1
    }
};


