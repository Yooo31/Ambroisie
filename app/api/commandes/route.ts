import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

interface Commande {
  numeroTable: number;
  status: string;
  content: string;
}

const filePath = path.join(process.cwd(), 'app/data/commandes.json');

// 📌 GET: Récupérer les commandes
export async function GET() {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const commandes = JSON.parse(data);
    return NextResponse.json(commandes, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Erreur de lecture des commandes' }, { status: 500 });
  }
}

// 📌 POST: Ajouter une nouvelle commande
export async function POST(req: Request) {
  try {
    const { serveurName, numeroTable, menuAdulteCount, menuEnfantCount } = await req.json();
    const data = await fs.readFile(filePath, 'utf-8');
    const commandes = JSON.parse(data);

    const existingOrder = commandes.find((cmd: any) => cmd.numeroTable === numeroTable);

    const newMenus = [
      ...Array(menuAdulteCount).fill({
        type: 'adulte',
        entree: 'attente',
        plat: 'attente',
        dessert: 'attente',
      }),
      ...Array(menuEnfantCount).fill({ type: 'enfant', plat: 'attente', dessert: 'attente' }),
    ];

    if (existingOrder) {
      existingOrder.content.push(...newMenus);
    } else {
      commandes.push({
        serveurName,
        numeroTable,
        status: 'En cours',
        content: newMenus,
      });
    }

    await fs.writeFile(filePath, JSON.stringify(commandes, null, 2));
    return NextResponse.json({ message: 'Commande enregistrée' }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de l’enregistrement de la commande' },
      { status: 500 },
    );
  }
}

// 📌 PUT: Mettre à jour une commande (ex: changer le statut)
export async function PUT(req: Request) {
  try {
    const { numeroTable, index, element, newStatus } = await req.json();
    const data = await fs.readFile(filePath, 'utf-8');
    const commandes = JSON.parse(data);

    const order = commandes.find((cmd: any) => cmd.numeroTable === numeroTable);
    if (!order) return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });

    order.content[index][element] = newStatus;

    await fs.writeFile(filePath, JSON.stringify(commandes, null, 2));
    return NextResponse.json({ message: 'Statut mis à jour' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

// 📌 DELETE: Supprimer une commande
export async function DELETE(req: Request) {
  try {
    const { numeroTable } = await req.json();
    const data = await fs.readFile(filePath, 'utf-8');
    const commandes: Commande[] = JSON.parse(data);

    const newCommandes = commandes.filter((cmd) => cmd.numeroTable !== numeroTable);

    await fs.writeFile(filePath, JSON.stringify(newCommandes, null, 2));
    return NextResponse.json({ message: 'Commande supprimée' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}
