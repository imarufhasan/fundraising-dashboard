import { Suspense } from "react";
import VerifyCodeContent from "./VerifyCodeContent";

export default function VerifyCodePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyCodeContent />
        </Suspense>
    );
}