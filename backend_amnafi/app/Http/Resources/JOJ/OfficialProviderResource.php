<?php

namespace App\Http\Resources\JOJ;

use Illuminate\Http\Resources\Json\JsonResource;

class OfficialProviderResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'photo' => $this->photo ? url('storage/' . $this->photo) : null,
            'specialty' => $this->specialty,
            'description' => $this->description,
            'certifications' => $this->certifications,
            'years_experience' => $this->years_experience,
            'intervention_zone' => $this->intervention_zone,
            'availability' => $this->availability,
            'languages' => $this->languages,
            'is_bilingual' => $this->is_bilingual,
            'badge_number' => $this->badge_number,
        ];
    }
}
