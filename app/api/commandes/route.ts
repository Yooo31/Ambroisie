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
    const newCommande = await req.json();
    const data = await fs.readFile(filePath, 'utf-8');
    const commandes = JSON.parse(data);

    commandes.push(newCommande);

    await fs.writeFile(filePath, JSON.stringify(commandes, null, 2));
    return NextResponse.json({ message: 'Commande ajoutée' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erreur lors de l’ajout de la commande' }, { status: 500 });
  }
}

// 📌 PUT: Mettre à jour une commande (ex: changer le statut)
export async function PUT(req: Request) {
  try {
    const { numeroTable, status, content } = await req.json();
    const data = await fs.readFile(filePath, 'utf-8');
    const commandes: Commande[] = JSON.parse(data);

    const index = commandes.findIndex((cmd) => cmd.numeroTable === numeroTable);
    if (index === -1) {
      return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });
    }

    commandes[index] = { ...commandes[index], status, content };

    await fs.writeFile(filePath, JSON.stringify(commandes, null, 2));
    return NextResponse.json({ message: 'Commande mise à jour' }, { status: 200 });
  } catch {
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
