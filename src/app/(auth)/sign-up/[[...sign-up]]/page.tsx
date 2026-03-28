import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0F1E] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[500px] -z-10 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-primary rounded-full blur-[100px]" />
      </div>
      
      <SignUp 
        appearance={{
          baseTheme: dark,
          elements: {
            formButtonPrimary: "bg-primary hover:bg-primary/90 text-sm normal-case",
            card: "bg-[#111827] border border-[#1F2937] shadow-2xl",
            headerTitle: "text-[#F9FAFB]",
            headerSubtitle: "text-[#9CA3AF]",
            socialButtonsBlockButton: "bg-[#1F2937] border-none text-[#F9FAFB] hover:bg-[#2D3748]",
            socialButtonsBlockButtonText: "text-[#F9FAFB]",
            dividerLine: "bg-[#1F2937]",
            dividerText: "text-[#9CA3AF]",
            formFieldLabel: "text-[#F9FAFB]",
            formFieldInput: "bg-[#0A0F1E] border-[#1F2937] text-[#F9FAFB]",
            footerActionText: "text-[#9CA3AF]",
            footerActionLink: "text-primary hover:text-primary/90",
          },
        }}
        routing="path"
        path="/sign-up"
        fallbackRedirectUrl="/dashboard"
      />
    </div>
  );
}
