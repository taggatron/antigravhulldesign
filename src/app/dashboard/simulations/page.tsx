"use client";

import { Activity, Play, CheckCircle2, Clock, XCircle, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const mockSimulations = [
  {
    id: "sim_9a8b7c6d",
    name: "Catamaran Hull Optim_v2",
    solver: "OpenFOAM (GPU)",
    status: "running",
    progress: 72,
    startedAt: "10 mins ago",
    eta: "4 mins"
  },
  {
    id: "sim_5f4e3d2c",
    name: "Cargo Bow Analysis",
    solver: "AI Surrogate Model",
    status: "completed",
    progress: 100,
    startedAt: "2 hours ago",
    eta: "-"
  },
  {
    id: "sim_1a2b3c4d",
    name: "Hydrofoil Draft Test 04",
    solver: "OpenFOAM (CPU)",
    status: "queued",
    progress: 0,
    startedAt: "-",
    eta: "Pending..."
  },
  {
    id: "sim_0f9e8d7c",
    name: "Rough Sea State Validation",
    solver: "OpenFOAM (GPU)",
    status: "failed",
    progress: 14,
    startedAt: "Yesterday",
    eta: "-"
  }
];

function getStatusIcon(status: string) {
  switch (status) {
    case "running": return <Activity className="w-4 h-4 text-blue-400 animate-pulse" />;
    case "completed": return <CheckCircle2 className="w-4 h-4 text-green-400" />;
    case "queued": return <Clock className="w-4 h-4 text-yellow-400" />;
    case "failed": return <XCircle className="w-4 h-4 text-red-400" />;
    default: return <MoreHorizontal className="w-4 h-4 text-muted-foreground" />;
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "running": return <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10">Running</Badge>;
    case "completed": return <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10">Completed</Badge>;
    case "queued": return <Badge variant="outline" className="border-yellow-500/30 text-yellow-400 bg-yellow-500/10">Queued</Badge>;
    case "failed": return <Badge variant="outline" className="border-red-500/30 text-red-400 bg-red-500/10">Failed</Badge>;
    default: return <Badge variant="outline">Unknown</Badge>;
  }
}

export default function SimulationsPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">CFD Job Queue</h1>
          <p className="text-muted-foreground">Manage your high-fidelity simulations and AI inference tasks.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Play className="w-4 h-4 mr-2" />
          New Simulation
        </Button>
      </div>

      <Card className="bg-black/40 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle>Active & Recent Jobs</CardTitle>
          <CardDescription>View progress logs and download output artifacts.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="w-[200px]">Simulation ID</TableHead>
                <TableHead>Project Name</TableHead>
                <TableHead>Solver</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[250px]">Progress</TableHead>
                <TableHead className="text-right">Started</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSimulations.map((sim) => (
                <TableRow key={sim.id} className="border-white/5 hover:bg-white/5">
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {sim.id}
                  </TableCell>
                  <TableCell className="font-medium text-white">
                    {sim.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {sim.solver}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(sim.status)}
                      {getStatusBadge(sim.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {sim.status === 'running' || sim.status === 'completed' ? (
                      <div className="flex items-center gap-3">
                        <Progress value={sim.progress} className="h-2 flex-1 [&>div]:bg-blue-500" />
                        <span className="text-xs font-mono text-muted-foreground w-8">
                          {sim.progress}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">
                        {sim.status === 'queued' ? 'Waiting for resources...' : 'Simulation halted'}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {sim.startedAt}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
