export default function Title({ text }: { text: string }) {
    return (
        <h2 className="text-[32px] font-bold text-foreground transition-colors">
            {text}
        </h2>
    )
}