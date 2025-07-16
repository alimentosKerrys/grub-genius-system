
import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"

interface AppLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
}

export function AppLayout({ children, title, description }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:block fixed inset-y-0 z-50 w-64">
          <div className="flex h-full flex-col bg-sidebar-background border-r border-sidebar-border">
            <Sidebar />
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:pl-64 flex-1">
          <Header />
          
          <main className="p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2 animate-fade-in">
                {title}
              </h1>
              {description && (
                <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: "0.1s" }}>
                  {description}
                </p>
              )}
            </div>
            
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
