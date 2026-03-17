<?php

namespace App\Http\Resources\JOJ;

use Illuminate\Http\Resources\Json\JsonResource;

class MissionResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'location' => $this->location,
            'preferred_date' => $this->preferred_date,
            'status' => $this->status,
            'admin_notes' => $this->admin_notes,
            'provider' => $this->when($this->provider, new OfficialProviderResource($this->provider)),
            'tourist' => $this->when($this->tourist, [
                'id' => $this->tourist->id,
                'name' => $this->tourist->name,
                'email' => $this->tourist->email
            ]),
            'validated_at' => $this->validated_at,
            'assigned_at' => $this->assigned_at,
            'completed_at' => $this->completed_at,
            'cancelled_reason' => $this->cancelled_reason,
            'created_at' => $this->created_at,
        ];
    }
}
