import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { Card, CardContent } from '@/components/ui/card';

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        <section className="py-16 gradient-bg">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">About CodeFusion AI</h1>
            <p className="text-lg text-white/80">
              A personal learning project by Yash Suthar.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="glass">
              <CardContent className="p-8 space-y-6 text-muted-foreground">
                <p>
                  CodeFusion AI is a web app built with React, TypeScript and Supabase. It has a
                  browser code editor (Monaco), sign-in with Supabase, a course catalog that links
                  to free videos and articles, course progress tracking and certificates.
                </p>
                <p>
                  The code editor does not run code on a server yet. The output panel shows a
                  simulated result, and the code tips panels use simple pattern checks, not a
                  live AI model.
                </p>
                <p>
                  The source code is on{' '}
                  <a
                    href="https://github.com/trynayash/CodeFusionAI"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                  .
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
