import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { Card, CardContent } from '@/components/ui/card';

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        <section className="py-16 gradient-bg">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Contact</h1>
            <p className="text-lg text-white/80">
              CodeFusion AI is a personal project. You can reach the developer here.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="glass">
              <CardContent className="p-8 space-y-4 text-muted-foreground">
                <p>
                  Email:{' '}
                  <a href="mailto:yashrsuthar90@gmail.com" className="text-primary hover:underline">
                    yashrsuthar90@gmail.com
                  </a>
                </p>
                <p>
                  Bugs and ideas:{' '}
                  <a
                    href="https://github.com/trynayash/CodeFusionAI/issues"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub issues
                  </a>
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
