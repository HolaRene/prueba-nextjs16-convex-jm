import Nabvar from "@/components/web/nabvar";

export default function LayoutCompartido({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Nabvar />
            {children}
        </>
    );
}
