export default function Text({ text }: { text: string }) {
    return (
        <p className="text-[16px] text-foreground-muted transition-colors">
            {text}
        </p>
    )
}