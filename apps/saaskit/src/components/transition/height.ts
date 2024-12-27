import { quartInOut } from "svelte/easing";

export default function height(
    node: HTMLElement,
    { duration }: { duration: number },
) {
    const height = Number.parseInt(getComputedStyle(node).height);
    const paddingTop = Number.parseInt(getComputedStyle(node).paddingTop);
    const paddingBottom = Number.parseInt(getComputedStyle(node).paddingBottom);
    const marginTop = Number.parseInt(getComputedStyle(node).marginTop);
    const marginBottom = Number.parseInt(getComputedStyle(node).marginBottom);
    const opacity = +getComputedStyle(node).opacity;

    return {
        duration,
        css: (t: number) => {
            const eased = quartInOut(t);

            const scaledOpacity = opacity / 5;
            return `
                    overflow: hidden;
                    margin-top: ${eased * marginTop};
                    margin-bottom: ${eased * marginBottom};
                    padding-top: ${eased * paddingTop};
                    padding-bottom: ${eased * paddingBottom};
                    height: ${eased * height};
                    opacity: ${scaledOpacity * t * 5};
                `;
        },
    };
}
